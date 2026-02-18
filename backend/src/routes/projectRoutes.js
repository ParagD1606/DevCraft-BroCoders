const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

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
    ownerId,
    missingSkills,
    roles: (project.roles || []).map((role, index) => ({
      id: role.id || `${project._id}-${index}`,
      title: role.title,
      skills: Array.isArray(role.skills) ? role.skills : [],
      commitment: commitmentLabel,
      spots: role.spots || 1,
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
      ? roles
          .filter((role) => role && role.title)
          .map((role) => ({
            title: String(role.title).trim(),
            skills: Array.isArray(role.skills)
              ? role.skills.map((skill) => String(skill).trim()).filter(Boolean)
              : [],
            spots: Math.max(1, Number(role.spots) || 1),
          }))
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

    return res.status(201).json({
      message: 'Project created successfully',
      project: toProjectListItem(project),
    });
  } catch (error) {
    console.error('Create project error:', error);
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
