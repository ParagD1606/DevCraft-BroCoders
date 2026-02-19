const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');
const { generateVirtualCtoPlan, enhancePlanWithLlm } = require('../utils/virtualCtoUtils');
const { generateEmbedding, EMBEDDING_DIMENSION } = require('../utils/embeddingUtils');
const { searchLocalVectors } = require('../utils/vectorUtils');
const { ensureProjectGroupChat } = require('../utils/projectChatUtils');

const router = express.Router();
const VIRTUAL_CTO_CACHE_TTL_MS = Number(process.env.VIRTUAL_CTO_CACHE_TTL_MS) > 0
  ? Number(process.env.VIRTUAL_CTO_CACHE_TTL_MS)
  : 5 * 60 * 1000;
const VIRTUAL_CTO_CACHE_MAX_ITEMS = 200;
const virtualCtoPackageCache = new Map();

function normalizeProjectType(status) {
  if (status === 'Completed') return 'completed';
  if (status === 'Pending') return 'pending';
  return 'active';
}

function formatDueDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function normalizeRoleInput(role) {
  if (!role || !role.title) return null;

  const title = String(role.title).trim();
  if (!title) return null;

  const skills = Array.isArray(role.skills)
    ? role.skills.map((skill) => String(skill).trim()).filter(Boolean)
    : String(role.skills || '')
        .split(',')
        .map((skill) => String(skill).trim())
        .filter(Boolean);

  const numericSpots = Number(role.spots);
  const spots = Number.isFinite(numericSpots) ? Math.max(1, Math.round(numericSpots)) : 1;

  const numericDurationHours = Number(role.durationHours);
  const durationHours =
    Number.isFinite(numericDurationHours) && numericDurationHours > 0
      ? Math.round(numericDurationHours)
      : null;

  return {
    title,
    skills,
    spots,
    durationHours,
  };
}

function tokenizeText(text) {
  return String(text || '')
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/g)
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildVirtualCtoCacheKey(userId, rawIdea) {
  return `${String(userId || '')}::${String(rawIdea || '').trim().toLowerCase()}`;
}

function cleanupVirtualCtoCache() {
  const now = Date.now();
  for (const [key, entry] of virtualCtoPackageCache.entries()) {
    if (!entry || Number(entry.expiresAt) <= now) {
      virtualCtoPackageCache.delete(key);
    }
  }

  if (virtualCtoPackageCache.size <= VIRTUAL_CTO_CACHE_MAX_ITEMS) return;
  const keys = [...virtualCtoPackageCache.keys()];
  const overflow = virtualCtoPackageCache.size - VIRTUAL_CTO_CACHE_MAX_ITEMS;
  for (let index = 0; index < overflow; index += 1) {
    virtualCtoPackageCache.delete(keys[index]);
  }
}

function readVirtualCtoCache(cacheKey) {
  cleanupVirtualCtoCache();
  const cached = virtualCtoPackageCache.get(cacheKey);
  if (!cached) return null;
  if (Number(cached.expiresAt) <= Date.now()) {
    virtualCtoPackageCache.delete(cacheKey);
    return null;
  }
  return cached.value || null;
}

function writeVirtualCtoCache(cacheKey, payload) {
  cleanupVirtualCtoCache();
  virtualCtoPackageCache.set(cacheKey, {
    value: payload,
    expiresAt: Date.now() + VIRTUAL_CTO_CACHE_TTL_MS,
  });
}

function toLowerSkillSet(skills = []) {
  return new Set(
    (Array.isArray(skills) ? skills : [])
      .map((skill) => String(skill || '').trim().toLowerCase())
      .filter(Boolean)
  );
}

function getPlanRequiredSkills(plan) {
  return Array.isArray(plan?.requiredSkills)
    ? plan.requiredSkills.map((skill) => String(skill || '').trim()).filter(Boolean)
    : [];
}

function scoreSkillMatch(requiredSkills = [], candidateSkills = []) {
  const required = toLowerSkillSet(requiredSkills);
  const candidate = toLowerSkillSet(candidateSkills);

  if (required.size === 0) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const matchedSkills = [...required].filter((skill) => candidate.has(skill));
  const missingSkills = [...required].filter((skill) => !candidate.has(skill));
  const score = matchedSkills.length / required.size;

  return {
    score: Number(score.toFixed(6)),
    matchedSkills,
    missingSkills,
  };
}

function buildArchitectQuery(plan, rawIdea) {
  const roleTitles = (Array.isArray(plan?.roles) ? plan.roles : [])
    .map((role) => String(role?.title || '').trim())
    .filter(Boolean)
    .join(', ');

  const requiredSkills = getPlanRequiredSkills(plan).join(', ');
  const techStack = (Array.isArray(plan?.techStack) ? plan.techStack : []).join(', ');

  return [
    `Idea: ${String(rawIdea || '').trim()}`,
    `Category: ${String(plan?.categoryLabel || plan?.category || '').trim()}`,
    roleTitles ? `Roles: ${roleTitles}` : '',
    requiredSkills ? `Required Skills: ${requiredSkills}` : '',
    techStack ? `Tech Stack: ${techStack}` : '',
  ]
    .filter(Boolean)
    .join('. ');
}

function mapArchitectCandidate(user, metadata = {}) {
  return {
    id: String(user?._id || user?.id || ''),
    name: user?.name || user?.email || 'Teammate',
    email: user?.email || '',
    role: user?.role || 'Member',
    skills: Array.isArray(user?.skills) ? user.skills : [],
    semanticScore: Number(metadata.semanticScore || 0),
    skillMatchScore: Number(metadata.skillMatchScore || 0),
    matchScore: Number(metadata.matchScore || 0),
    matchedSkills: Array.isArray(metadata.matchedSkills) ? metadata.matchedSkills : [],
    missingSkills: Array.isArray(metadata.missingSkills) ? metadata.missingSkills : [],
    matchSource: metadata.matchSource || 'skill',
    githubConnected: Boolean(user?.githubId || user?.githubUsername),
  };
}

async function findArchitectCandidates({ plan, rawIdea, currentUserId, limit = 6 }) {
  const normalizedLimit = Math.max(1, Math.min(10, Number(limit) || 6));
  const requiredSkills = getPlanRequiredSkills(plan);
  const queryTokens = tokenizeText(`${rawIdea} ${requiredSkills.join(' ')}`);
  const queryText = buildArchitectQuery(plan, rawIdea);

  const candidates = await User.find({ _id: { $ne: currentUserId } })
    .select(
      '+embedding name email role skills bio interests experienceLevel availabilityStatus githubId githubUsername'
    )
    .limit(300);

  const indexedCandidates = candidates.filter(
    (candidate) =>
      Array.isArray(candidate?.embedding) && candidate.embedding.length === EMBEDDING_DIMENSION
  );

  let semanticResults = [];
  if (indexedCandidates.length > 0) {
    try {
      const queryVector = await generateEmbedding(queryText);
      semanticResults = searchLocalVectors(queryVector, indexedCandidates, normalizedLimit * 4);
    } catch (error) {
      console.error('Virtual CTO semantic candidate search failed:', error?.message || error);
      semanticResults = [];
    }
  }

  const semanticMap = new Map(
    semanticResults.map((entry) => [String(entry?._id || entry?.id || ''), entry])
  );

  const scoredCandidates = candidates
    .map((candidateDoc) => {
      const candidate = typeof candidateDoc?.toObject === 'function'
        ? candidateDoc.toObject()
        : candidateDoc;
      const candidateId = String(candidate?._id || candidate?.id || '');
      const semanticScore = Number(semanticMap.get(candidateId)?.semanticScore || 0);
      const skillAnalysis = scoreSkillMatch(requiredSkills, candidate?.skills || []);
      const userText = [
        candidate?.role,
        candidate?.bio,
        ...(Array.isArray(candidate?.skills) ? candidate.skills : []),
      ]
        .join(' ')
        .toLowerCase();
      const keywordHits = queryTokens.reduce(
        (count, token) => (userText.includes(token) ? count + 1 : count),
        0
      );
      const keywordScore =
        queryTokens.length > 0 ? Number((keywordHits / queryTokens.length).toFixed(6)) : 0;

      const matchScore = Number(
        (semanticScore * 0.55 + skillAnalysis.score * 0.35 + keywordScore * 0.1).toFixed(6)
      );

      return mapArchitectCandidate(candidate, {
        semanticScore,
        skillMatchScore: skillAnalysis.score,
        matchScore,
        matchedSkills: skillAnalysis.matchedSkills,
        missingSkills: skillAnalysis.missingSkills,
        matchSource: semanticScore > 0 ? 'semantic+skills' : 'skills+keyword',
      });
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, normalizedLimit);

  return scoredCandidates;
}

function computeSetIntersectionSize(setA, setB) {
  let count = 0;
  for (const value of setA) {
    if (setB.has(value)) count += 1;
  }
  return count;
}

function buildCandidateTeammateSuggestions(candidates = [], requiredSkills = []) {
  const normalizedCandidates = Array.isArray(candidates) ? candidates : [];
  const required = toLowerSkillSet(requiredSkills);
  const suggestions = [];

  for (let index = 0; index < normalizedCandidates.length; index += 1) {
    for (let peerIndex = index + 1; peerIndex < normalizedCandidates.length; peerIndex += 1) {
      const candidateA = normalizedCandidates[index];
      const candidateB = normalizedCandidates[peerIndex];
      const skillsA = toLowerSkillSet(candidateA?.skills || []);
      const skillsB = toLowerSkillSet(candidateB?.skills || []);
      const union = new Set([...skillsA, ...skillsB]);
      const overlapRequired = computeSetIntersectionSize(required, union);
      const overlapBetweenCandidates = computeSetIntersectionSize(skillsA, skillsB);
      const complementarity = Math.max(0, union.size - overlapBetweenCandidates);
      const coverageScore = required.size > 0 ? overlapRequired / required.size : 0;
      const synergyScore = Number((coverageScore * 0.7 + (complementarity / Math.max(1, union.size)) * 0.3).toFixed(6));

      if (synergyScore <= 0) continue;

      const uncovered = [...required].filter((skill) => !union.has(skill)).slice(0, 5);
      suggestions.push({
        pair: [
          { id: candidateA.id, name: candidateA.name },
          { id: candidateB.id, name: candidateB.name },
        ],
        synergyScore,
        coveredSkills: [...required].filter((skill) => union.has(skill)).slice(0, 8),
        uncoveredSkills: uncovered,
        recommendation:
          uncovered.length === 0
            ? 'Strong pair for immediate execution.'
            : `Strong pair; add one teammate for: ${uncovered.join(', ')}`,
      });
    }
  }

  return suggestions.sort((a, b) => b.synergyScore - a.synergyScore).slice(0, 5);
}

async function buildEcosystemInsights(currentUserId) {
  const [projectSnapshot, skillSnapshot, userCount] = await Promise.all([
    Project.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$category', 'General'] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    User.aggregate([
      { $match: { _id: { $ne: currentUserId } } },
      { $unwind: { path: '$skills', preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: { $toLower: '$skills' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]),
    User.countDocuments(),
  ]);

  return {
    activeCommunitySize: userCount,
    topProjectCategories: projectSnapshot.map((item) => ({
      category: String(item?._id || 'General'),
      projects: Number(item?.count || 0),
    })),
    topCommunitySkills: skillSnapshot.map((item) => ({
      skill: String(item?._id || '').trim(),
      users: Number(item?.count || 0),
    })),
  };
}

function buildUserContext(user = {}) {
  return {
    id: String(user?._id || ''),
    name: user?.name || '',
    role: user?.role || '',
    skills: Array.isArray(user?.skills) ? user.skills : [],
    interests: Array.isArray(user?.interests) ? user.interests : [],
    availabilityStatus: user?.availabilityStatus || '',
  };
}

async function buildVirtualCtoPackage({ rawIdea, user }) {
  const startedAt = Date.now();
  const cacheKey = buildVirtualCtoCacheKey(user?._id, rawIdea);
  const cachedPayload = readVirtualCtoCache(cacheKey);
  if (cachedPayload) {
    return {
      ...cachedPayload,
      meta: {
        ...(cachedPayload?.meta || {}),
        cached: true,
        generatedInMs: Date.now() - startedAt,
      },
    };
  }

  const ecosystemInsights = await buildEcosystemInsights(user?._id);
  const basePlan = generateVirtualCtoPlan(rawIdea);

  let plan = basePlan;
  try {
    plan = await enhancePlanWithLlm(basePlan, rawIdea, {
      userContext: buildUserContext(user),
      ecosystemInsights,
    });
  } catch (error) {
    console.error('Virtual CTO LLM enhancement fallback:', error?.message || error);
  }

  const candidates = await findArchitectCandidates({
    plan,
    rawIdea,
    currentUserId: user?._id,
    limit: 8,
  });
  const teammateSuggestions = buildCandidateTeammateSuggestions(
    candidates,
    getPlanRequiredSkills(plan)
  );

  const payload = {
    plan,
    candidates,
    teammateSuggestions,
    ecosystemInsights,
    meta: {
      generationMode: plan?.generationMode || 'heuristic',
      requiredSkillsCount: Array.isArray(plan?.requiredSkills) ? plan.requiredSkills.length : 0,
      candidatesCount: candidates.length,
      teammatePairSuggestionsCount: teammateSuggestions.length,
      cached: false,
      generatedInMs: Date.now() - startedAt,
    },
  };
  writeVirtualCtoCache(cacheKey, payload);
  return payload;
}

function writeStreamChunk(res, payload) {
  res.write(`${JSON.stringify(payload)}\n`);
}

function toProjectListItem(project, currentUserId = null) {
  const ownerId = String(project?.owner?._id || project?.owner || '');
  const normalizedCurrentUserId = currentUserId ? String(currentUserId) : '';
  const normalizedMembers = Array.isArray(project?.members) ? project.members : [];
  const computedTeamSize = 1 + normalizedMembers.length;

  let role = 'Owner';
  if (normalizedCurrentUserId && ownerId !== normalizedCurrentUserId) {
    const membership = normalizedMembers.find(
      (member) => String(member?.user?._id || member?.user || '') === normalizedCurrentUserId
    );
    role = membership?.role || 'Member';
  }

  return {
    id: String(project._id),
    title: project.title,
    status: project.status,
    role,
    description: project.description,
    teamSize: Math.max(1, project.teamSize || computedTeamSize),
    dueDate: formatDueDate(project.endDate),
    progress: project.progress,
    type: normalizeProjectType(project.status),
    category: project.category,
    commitment: project.commitment,
    startDate: project.startDate,
    endDate: project.endDate,
    roles: project.roles || [],
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

function formatReadableDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function toProjectDetail(project, currentUser) {
  const owner = project.owner || {};
  const ownerId = String(owner._id || project.owner || '');
  const currentUserId = String(currentUser?._id || '');
  const isOwner = ownerId === currentUserId;
  const commitmentLabel = project.commitment
    ? String(project.commitment).replace(/_/g, ' ')
    : 'Flexible';

  const requiredSkills = Array.from(
    new Set(
      (project.roles || [])
        .flatMap((role) => (Array.isArray(role.skills) ? role.skills : []))
        .map((skill) => String(skill).trim())
        .filter(Boolean)
    )
  );

  const userSkills = new Set(
    Array.isArray(currentUser?.skills)
      ? currentUser.skills.map((skill) => String(skill).trim().toLowerCase())
      : []
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !userSkills.has(String(skill).toLowerCase())
  );

  const normalizedMembers = Array.isArray(project.members) ? project.members : [];
  const isMember = normalizedMembers.some(
    (member) => String(member?.user?._id || member?.user || '') === currentUserId
  );
  const teamMembers = normalizedMembers
    .map((member) => {
      const user = member?.user || {};
      const userId = user?._id || member?.user;
      if (!userId) return null;
      return {
        id: String(userId),
        name: user.name || user.email || 'Team Member',
        role: member?.role || 'Contributor',
        isLead: false,
        avatar:
          user.avatar ||
          'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
      };
    })
    .filter(Boolean);

  return {
    id: String(project._id),
    title: project.title,
    status: project.status,
    progress: Number(project.progress) || 0,
    shortDescription: project.description,
    fullDescription: project.description,
    category: project.category || 'General',
    startDate: formatReadableDate(project.startDate || project.createdAt),
    isOwner,
    isMember,
    ownerId,
    missingSkills,
    roles: (project.roles || []).map((role, index) => ({
      id: role.id || `${project._id}-${index}`,
      title: role.title,
      skills: Array.isArray(role.skills) ? role.skills : [],
      commitment: commitmentLabel,
      spots: Number.isFinite(Number(role.spots)) ? Number(role.spots) : 1,
      durationHours: Number(role.durationHours) || null,
    })),
    team: [
      {
        id: ownerId,
        name: owner.name || owner.email || 'Project Owner',
        role: 'Project Owner',
        isLead: true,
        avatar:
          owner.avatar ||
          'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
      },
      ...teamMembers,
    ],
  };
}

function toBazaarFeedItems(projects, query = {}) {
  const search = String(query.search || '')
    .trim()
    .toLowerCase();
  const skill = String(query.skill || '')
    .trim()
    .toLowerCase();

  const items = projects.flatMap((project) => {
    const owner = project.owner || {};
    const ownerId = String(owner._id || project.owner || '');

    return (project.roles || [])
      .filter((role) => role && role.title && (Number(role.spots) || 0) > 0)
      .map((role, index) => {
        const roleSkills = Array.isArray(role.skills) ? role.skills : [];
        return {
          id: `${project._id}-${index}`,
          projectId: String(project._id),
          projectTitle: project.title,
          projectDescription: project.description,
          projectCategory: project.category || 'General',
          projectStatus: project.status,
          projectProgress: Number(project.progress) || 0,
          projectCommitment: project.commitment || 'Flexible',
          owner: {
            id: ownerId,
            name: owner.name || owner.email || 'Project Owner',
          },
          roleTitle: role.title,
          skills: roleSkills,
          spots: Number(role.spots) || 1,
          durationHours: Number(role.durationHours) || null,
          postedAt: project.updatedAt || project.createdAt,
        };
      });
  });

  return items
    .filter((item) => {
      if (skill) {
        const hasSkill = item.skills.some(
          (itemSkill) => String(itemSkill).trim().toLowerCase() === skill
        );
        if (!hasSkill) return false;
      }

      if (!search) return true;

      const searchCorpus = [
        item.projectTitle,
        item.projectDescription,
        item.projectCategory,
        item.roleTitle,
        item.owner?.name,
        ...(item.skills || []),
      ]
        .join(' ')
        .toLowerCase();
      return searchCorpus.includes(search);
    })
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
}

async function notifyConnectionsAboutNewProject({ ownerId, ownerName, project }) {
  const owner = await User.findById(ownerId).select('connections');
  const rawConnections = Array.isArray(owner?.connections) ? owner.connections : [];
  const connectionIds = rawConnections
    .map((id) => String(id))
    .filter(Boolean)
    .filter((id) => id !== String(ownerId));

  if (connectionIds.length === 0) return 0;

  const existingUsers = await User.find({ _id: { $in: connectionIds } }).select('_id');
  const recipientIds = existingUsers.map((user) => user._id);

  if (recipientIds.length === 0) return 0;

  const notifications = recipientIds.map((recipientId) => ({
    recipient: recipientId,
    sender: ownerId,
    type: 'connection_project_created',
    project: project._id,
    title: 'New Project by Your Connection',
    message: `${ownerName} created a new project: "${project.title}".`,
    isRead: false,
  }));

  await Notification.insertMany(notifications, { ordered: false });
  return notifications.length;
}

// @desc    Create a new project
// @route   POST /api/project
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      category = '',
      roles = [],
      startDate = null,
      endDate = null,
      commitment = '',
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const normalizedRoles = Array.isArray(roles)
      ? roles.map(normalizeRoleInput).filter(Boolean)
      : [];

    const project = await Project.create({
      owner: req.user._id,
      title: String(title).trim(),
      description: String(description).trim(),
      category: String(category || '').trim(),
      roles: normalizedRoles,
      startDate: startDate || null,
      endDate: endDate || null,
      commitment: String(commitment || '').trim(),
      members: [],
      status: 'In Progress',
      progress: 0,
      teamSize: 1,
    });

    try {
      await ensureProjectGroupChat(project);
    } catch (chatError) {
      console.error('Ensure project group chat error:', chatError);
    }

    const ownerName = req.user.name || req.user.email || 'Someone';
    try {
      await notifyConnectionsAboutNewProject({
        ownerId: req.user._id,
        ownerName,
        project,
      });
    } catch (notifyError) {
      console.error('Project connection notification error:', notifyError);
    }

    return res.status(201).json({
      message: 'Project created successfully',
      project: toProjectListItem(project),
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Generate a project blueprint from a raw idea (Virtual CTO)
// @route   POST /api/project/virtual-cto/plan
// @access  Private
router.post('/virtual-cto/plan', protect, async (req, res) => {
  try {
    const rawIdea = String(req.body?.idea || '').trim();
    if (!rawIdea) {
      return res.status(400).json({ error: 'idea is required' });
    }

    if (rawIdea.length < 12) {
      return res.status(400).json({
        error: 'Please provide a bit more detail so the Virtual CTO can generate a useful plan',
      });
    }

    const payload = await buildVirtualCtoPackage({
      rawIdea,
      user: req.user,
    });

    return res.status(200).json(payload);
  } catch (error) {
    console.error('Virtual CTO plan generation error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Stream Virtual CTO plan generation progress and result
// @route   POST /api/project/virtual-cto/stream
// @access  Private
router.post('/virtual-cto/stream', protect, async (req, res) => {
  const rawIdea = String(req.body?.idea || '').trim();
  if (!rawIdea) {
    return res.status(400).json({ error: 'idea is required' });
  }
  if (rawIdea.length < 12) {
    return res.status(400).json({
      error: 'Please provide a bit more detail so the Virtual CTO can generate a useful plan',
    });
  }

  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }

  try {
    writeStreamChunk(res, { type: 'status', message: 'Analyzing project idea...' });
    writeStreamChunk(res, { type: 'status', message: 'Building architecture and roadmap...' });
    const payload = await buildVirtualCtoPackage({
      rawIdea,
      user: req.user,
    });
    writeStreamChunk(res, { type: 'insights', data: payload.ecosystemInsights || null });
    writeStreamChunk(res, { type: 'plan', data: payload.plan || null });
    writeStreamChunk(res, { type: 'candidates', data: payload.candidates || [] });
    writeStreamChunk(
      res,
      { type: 'teammate_suggestions', data: payload.teammateSuggestions || [] }
    );
    writeStreamChunk(res, {
      type: 'status',
      message:
        payload?.meta?.cached
          ? 'Loaded cached result for faster response.'
          : `Completed in ${payload?.meta?.generatedInMs || 0}ms.`,
    });

    writeStreamChunk(res, { type: 'done', data: payload });
    return res.end();
  } catch (error) {
    console.error('Virtual CTO stream error:', error);
    writeStreamChunk(res, {
      type: 'error',
      message: error?.message || 'Virtual CTO stream failed',
    });
    return res.end();
  }
});

// @desc    Apply to an open project role
// @route   POST /api/project/:id/apply
// @access  Private
router.post('/:id/apply', protect, async (req, res) => {
  try {
    const roleTitleInput = String(req.body?.roleTitle || '').trim();
    if (!roleTitleInput) {
      return res.status(400).json({ error: 'roleTitle is required to apply' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const ownerId = String(project.owner);
    const applicantId = String(req.user._id);

    if (ownerId === applicantId) {
      return res.status(400).json({ error: 'Project owner cannot apply to own project' });
    }

    const isAlreadyMember = (project.members || []).some(
      (member) => String(member.user) === applicantId
    );
    if (isAlreadyMember) {
      return res.status(400).json({ error: 'You are already a member of this project' });
    }

    const normalizedRequestedRole = roleTitleInput.toLowerCase();
    const matchingRole = (project.roles || []).find(
      (role) => String(role?.title || '').trim().toLowerCase() === normalizedRequestedRole
    );

    if (!matchingRole) {
      return res.status(404).json({ error: 'Requested role not found in this project' });
    }

    if ((Number(matchingRole.spots) || 0) < 1) {
      return res.status(400).json({ error: 'No spots left for this role' });
    }

    const existingPendingApplication = await Notification.findOne({
      recipient: project.owner,
      sender: req.user._id,
      project: project._id,
      type: 'project_application',
      status: 'pending',
    });

    if (existingPendingApplication) {
      return res.status(409).json({ error: 'You already have a pending application for this project' });
    }

    const applicantName = req.user.name || req.user.email || 'A user';
    const createdNotification = await Notification.create({
      recipient: project.owner,
      sender: req.user._id,
      type: 'project_application',
      project: project._id,
      roleTitle: matchingRole.title,
      title: 'New Project Application',
      message: `${applicantName} applied for "${matchingRole.title}" in "${project.title}".`,
      status: 'pending',
      isRead: false,
    });

    return res.status(201).json({
      message: 'Application submitted successfully',
      notificationId: String(createdNotification._id),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'You already have a pending application for this project' });
    }
    console.error('Apply to project error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Fetch current user's projects
// @route   GET /api/project/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
    }).sort({ updatedAt: -1 });
    return res.status(200).json({
      projects: projects.map((project) => toProjectListItem(project, req.user._id)),
    });
  } catch (error) {
    console.error('Fetch my projects error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Fetch Project Bazaar feed (all open roles)
// @route   GET /api/project/bazaar
// @access  Private
router.get('/bazaar', protect, async (req, res) => {
  try {
    const projects = await Project.find({
      status: { $ne: 'Completed' },
    }).populate('owner', 'name email');

    const items = toBazaarFeedItems(projects, req.query || {});

    return res.status(200).json({
      items,
      count: items.length,
    });
  } catch (error) {
    console.error('Fetch project bazaar error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Add an open role to project (owner only)
// @route   POST /api/project/:id/roles
// @access  Private
router.post('/:id/roles', protect, async (req, res) => {
  try {
    const normalizedRole = normalizeRoleInput(req.body || {});
    if (!normalizedRole) {
      return res.status(400).json({ error: 'Role title is required' });
    }

    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (String(project.owner?._id || project.owner) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Only the project owner can post open roles' });
    }

    project.roles.push(normalizedRole);
    await project.save();

    return res.status(201).json({
      message: 'Open role posted successfully',
      project: toProjectDetail(project, req.user),
    });
  } catch (error) {
    console.error('Post open role error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Invite a user to a project (owner only)
// @route   POST /api/project/:id/invite
// @access  Private
router.post('/:id/invite', protect, async (req, res) => {
  try {
    const { userId, email, role } = req.body || {};

    if (!userId && !email) {
      return res.status(400).json({ error: 'Provide userId or email to invite' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (String(project.owner) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Only the project owner can invite members' });
    }

    let invitedUser = null;
    if (userId) {
      invitedUser = await User.findById(userId);
    } else if (email) {
      invitedUser = await User.findOne({ email: String(email).trim().toLowerCase() });
    }

    if (!invitedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (String(invitedUser._id) === String(project.owner)) {
      return res.status(400).json({ error: 'Project owner is already part of this project' });
    }

    const existingMember = (project.members || []).some(
      (member) => String(member.user) === String(invitedUser._id)
    );
    if (existingMember) {
      return res.status(409).json({ error: 'User is already a member of this project' });
    }

    const existingPendingInvite = await Notification.findOne({
      recipient: invitedUser._id,
      project: project._id,
      type: 'project_invite',
      status: 'pending',
    });

    if (existingPendingInvite) {
      return res.status(409).json({ error: 'A pending invite already exists for this user' });
    }

    const inviteRole = String(role || 'Contributor').trim() || 'Contributor';
    const senderName = req.user.name || req.user.email || 'A project owner';
    const notification = await Notification.create({
      recipient: invitedUser._id,
      sender: req.user._id,
      type: 'project_invite',
      project: project._id,
      inviteRole,
      title: 'Project Invitation',
      message: `${senderName} invited you to join "${project.title}" as ${inviteRole}.`,
      status: 'pending',
      isRead: false,
    });

    return res.status(201).json({
      message: 'Invitation sent successfully',
      notification: {
        id: String(notification._id),
        recipientId: String(invitedUser._id),
        projectId: String(project._id),
        inviteRole: notification.inviteRole,
        status: notification.status,
        createdAt: notification.createdAt,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'A pending invite already exists for this user' });
    }
    console.error('Invite member error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update project progress (owner only)
// @route   PATCH /api/project/:id/progress
// @access  Private
router.patch('/:id/progress', protect, async (req, res) => {
  try {
    const { progress } = req.body || {};
    const normalizedProgress = Number(progress);

    if (!Number.isFinite(normalizedProgress)) {
      return res.status(400).json({ error: 'Progress must be a number between 0 and 100' });
    }

    if (normalizedProgress < 0 || normalizedProgress > 100) {
      return res.status(400).json({ error: 'Progress must be between 0 and 100' });
    }

    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (String(project.owner?._id || project.owner) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Only the project owner can update progress' });
    }

    const roundedProgress = Math.round(normalizedProgress);
    project.progress = roundedProgress;

    if (roundedProgress === 100) {
      project.status = 'Completed';
    } else if (project.status === 'Completed') {
      project.status = 'In Progress';
    }

    await project.save();

    return res.status(200).json({
      message: 'Project progress updated',
      project: toProjectDetail(project, req.user),
    });
  } catch (error) {
    console.error('Update project progress error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Fetch a project by id
// @route   GET /api/project/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(200).json({
      project: toProjectDetail(project, req.user),
    });
  } catch (error) {
    console.error('Fetch project detail error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
