const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

async function fetchGitHubJson(path, extraHeaders = {}) {
    const response = await fetch(`https://api.github.com${path}`, {
        headers: {
            'User-Agent': 'DevCraft-BroCoders',
            'Accept': 'application/vnd.github.v3+json',
            ...extraHeaders,
        },
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        const error = new Error(payload?.message || 'GitHub API request failed');
        error.statusCode = response.status;
        throw error;
    }

    return payload;
}

async function fetchGitHubText(path, options = {}) {
    const { method = 'GET', body, accept = 'text/plain', extraHeaders = {} } = options;
    const response = await fetch(`https://api.github.com${path}`, {
        method,
        headers: {
            'User-Agent': 'DevCraft-BroCoders',
            Accept: accept,
            ...(body ? { 'Content-Type': 'application/json' } : {}),
            ...extraHeaders,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const payload = await response.text();
    if (!response.ok) {
        let errorMessage = payload || 'GitHub API request failed';
        try {
            const parsedPayload = JSON.parse(payload);
            errorMessage = parsedPayload?.message || errorMessage;
        } catch (_error) {
            // Keep raw text payload as fallback.
        }

        const error = new Error(errorMessage);
        error.statusCode = response.status;
        throw error;
    }

    return payload;
}

async function resolveGitHubUsername(user) {
    if (!user) return null;

    let githubUsername = user.githubUsername;

    // Backward compatibility: resolve and store username for older linked users.
    if (!githubUsername && user.githubId) {
        const githubUser = await fetchGitHubJson(`/user/${encodeURIComponent(user.githubId)}`);
        githubUsername = githubUser?.login;
        if (githubUsername) {
            user.githubUsername = githubUsername;
            await user.save();
        }
    }

    return githubUsername;
}

function formatGitHubRepo(repo) {
    return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        visibility: repo.visibility,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        watchers_count: repo.watchers_count,
        open_issues_count: repo.open_issues_count,
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
    };
}

async function fetchGitHubProfileReadme(githubUsername) {
    try {
        const readme = await fetchGitHubJson(
            `/repos/${encodeURIComponent(githubUsername)}/${encodeURIComponent(githubUsername)}/readme`
        );

        let content = '';
        if (readme?.encoding === 'base64' && typeof readme.content === 'string') {
            content = Buffer.from(readme.content.replace(/\n/g, ''), 'base64').toString('utf8');
        }

        let renderedHtml = '';
        const normalizedContent = String(content || '').trim();
        if (normalizedContent) {
            try {
                renderedHtml = await fetchGitHubText('/markdown', {
                    method: 'POST',
                    accept: 'application/vnd.github.v3.html',
                    body: {
                        text: normalizedContent,
                        mode: 'gfm',
                        context: `${githubUsername}/${githubUsername}`,
                    },
                });
            } catch (renderError) {
                console.warn('Render GitHub README HTML error:', renderError?.message || renderError);
            }
        }

        return {
            content: normalizedContent,
            renderedHtml: String(renderedHtml || '').trim(),
            htmlUrl: readme?.html_url || '',
            sha: readme?.sha || '',
        };
    } catch (error) {
        if (error?.statusCode === 404) {
            return null;
        }
        throw error;
    }
}

async function buildGitHubSummaryForUser(user, githubUsername) {
    const [githubProfile, repos] = await Promise.all([
        fetchGitHubJson(`/users/${encodeURIComponent(githubUsername)}`),
        fetchGitHubJson(
            `/users/${encodeURIComponent(githubUsername)}/repos?sort=updated&per_page=100`,
            { Accept: 'application/vnd.github+json' }
        ),
    ]);

    const normalizedRepos = (Array.isArray(repos) ? repos : []).map(formatGitHubRepo);

    const languageMap = normalizedRepos.reduce((acc, repo) => {
        if (repo.language) {
            acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
    }, {});

    const topLanguages = Object.entries(languageMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([language, repoCount]) => ({ language, repoCount }));

    const stats = {
        totalRepos: normalizedRepos.length,
        publicRepos: githubProfile?.public_repos || 0,
        followers: githubProfile?.followers || 0,
        following: githubProfile?.following || 0,
        totalStars: normalizedRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
        totalForks: normalizedRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
        totalWatchers: normalizedRepos.reduce((sum, repo) => sum + (repo.watchers_count || 0), 0),
        totalOpenIssues: normalizedRepos.reduce((sum, repo) => sum + (repo.open_issues_count || 0), 0),
        topLanguage: topLanguages[0]?.language || 'N/A',
        topLanguages,
    };

    let profileReadme = user.githubProfileReadme || null;
    try {
        const fetchedReadme = await fetchGitHubProfileReadme(githubUsername);
        const hasReadmeContent = Boolean(fetchedReadme?.content || fetchedReadme?.renderedHtml);

        if (hasReadmeContent) {
            const hasChanged =
                (user.githubProfileReadme?.sha || '') !== fetchedReadme.sha ||
                (user.githubProfileReadme?.content || '') !== fetchedReadme.content ||
                (user.githubProfileReadme?.renderedHtml || '') !== fetchedReadme.renderedHtml ||
                (user.githubProfileReadme?.htmlUrl || '') !== fetchedReadme.htmlUrl;

            if (hasChanged || !user.githubProfileReadme?.fetchedAt) {
                user.githubProfileReadme = {
                    content: fetchedReadme.content,
                    renderedHtml: fetchedReadme.renderedHtml,
                    htmlUrl: fetchedReadme.htmlUrl,
                    sha: fetchedReadme.sha,
                    fetchedAt: new Date(),
                };
            } else {
                user.githubProfileReadme.fetchedAt = new Date();
            }

            profileReadme = user.githubProfileReadme;
        } else if (user.githubProfileReadme?.content || user.githubProfileReadme?.renderedHtml) {
            user.githubProfileReadme = undefined;
            profileReadme = null;
        }
    } catch (readmeError) {
        console.warn('Fetch GitHub profile README error:', readmeError?.message || readmeError);
    }

    const summary = {
        profile: {
            login: githubProfile?.login,
            name: githubProfile?.name,
            avatar_url: githubProfile?.avatar_url,
            bio: githubProfile?.bio,
            company: githubProfile?.company,
            blog: githubProfile?.blog,
            location: githubProfile?.location,
            twitter_username: githubProfile?.twitter_username,
            html_url: githubProfile?.html_url,
            created_at: githubProfile?.created_at,
            updated_at: githubProfile?.updated_at,
        },
        stats,
        repos: normalizedRepos,
        profileReadme: profileReadme
            ? {
                content: profileReadme.content || '',
                renderedHtml: profileReadme.renderedHtml || '',
                htmlUrl: profileReadme.htmlUrl || '',
                fetchedAt: profileReadme.fetchedAt || null,
            }
            : null,
    };

    user.githubSummaryCache = {
        profile: summary.profile,
        stats: summary.stats,
        repos: summary.repos,
        profileReadme: summary.profileReadme,
        fetchedAt: new Date(),
    };
    user.markModified('githubSummaryCache');
    await user.save();

    return summary;
}

function getStoredGitHubSummary(user) {
    const cache = user?.githubSummaryCache;
    if (!cache || !cache.fetchedAt) {
        return null;
    }

    return {
        profile: cache.profile || {},
        stats: cache.stats || {},
        repos: Array.isArray(cache.repos) ? cache.repos : [],
        profileReadme: cache.profileReadme || null,
    };
}

function toLowerSet(values = []) {
    return new Set(
        (Array.isArray(values) ? values : [])
            .map((value) => String(value || '').trim().toLowerCase())
            .filter(Boolean)
    );
}

function calculateProfileCompletion(user) {
    if (!user) return 0;

    const checkpoints = [
        Boolean(String(user.name || '').trim()),
        Number.isFinite(Number(user.age)),
        Boolean(String(user.qualifications || '').trim()),
        Boolean(String(user.role || '').trim()),
        Boolean(String(user.bio || '').trim()),
        Boolean(String(user.location || '').trim()),
        Boolean(String(user.website || '').trim()),
        Array.isArray(user.skills) && user.skills.length > 0,
        Array.isArray(user.interests) && user.interests.length > 0,
        Boolean(user.githubId || user.githubUsername),
    ];

    const completed = checkpoints.filter(Boolean).length;
    return Math.round((completed / checkpoints.length) * 100);
}

function getProjectType(status) {
    if (status === 'Completed') return 'completed';
    if (status === 'Pending') return 'pending';
    return 'active';
}

function mapDashboardProject(project, currentUserId) {
    const ownerId = String(project?.owner?._id || project?.owner || '');
    const currentId = String(currentUserId || '');
    const members = Array.isArray(project?.members) ? project.members : [];
    const membership = members.find(
        (member) => String(member?.user?._id || member?.user || '') === currentId
    );
    const role = ownerId === currentId ? 'Owner' : (membership?.role || 'Member');
    const teamSize = Math.max(1, Number(project?.teamSize) || 1 + members.length);

    return {
        id: String(project?._id || ''),
        title: project?.title || 'Untitled Project',
        role,
        status: project?.status || 'In Progress',
        progress: Math.max(0, Math.min(100, Number(project?.progress) || 0)),
        teamSize,
        type: getProjectType(project?.status),
        updatedAt: project?.updatedAt || project?.createdAt || null,
    };
}

function buildSuggestedMatches(currentUser, users) {
    const mySkills = toLowerSet(currentUser?.skills || []);
    const myRole = String(currentUser?.role || '').trim().toLowerCase();

    return (Array.isArray(users) ? users : [])
        .map((candidate) => {
            const candidateSkills = Array.isArray(candidate?.skills) ? candidate.skills : [];
            const candidateSkillSet = toLowerSet(candidateSkills);
            const overlapCount = [...mySkills].filter((skill) => candidateSkillSet.has(skill)).length;
            const unionCount = new Set([...mySkills, ...candidateSkillSet]).size;
            const skillMatch = unionCount > 0 ? Math.round((overlapCount / unionCount) * 100) : 0;
            const roleMatch =
                myRole && String(candidate?.role || '').trim().toLowerCase() === myRole ? 10 : 0;
            const profileDepthBonus = Math.min(10, candidateSkillSet.size * 2);
            const matchScore = Math.min(99, Math.max(0, skillMatch + roleMatch + profileDepthBonus));

            const highlightedSkills =
                overlapCount > 0
                    ? candidateSkills.filter((skill) =>
                          mySkills.has(String(skill || '').trim().toLowerCase())
                      )
                    : candidateSkills;

            return {
                id: String(candidate?._id || ''),
                name: candidate?.name || candidate?.email || 'Teammate',
                role: candidate?.role || 'Member',
                matchScore,
                matchLabel: `${matchScore}%`,
                skills: highlightedSkills.slice(0, 4),
            };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6);
}

function buildSkillGapSummary(currentUser, projects) {
    const mySkills = toLowerSet(currentUser?.skills || []);
    const activeProjects = (Array.isArray(projects) ? projects : []).filter(
        (project) => getProjectType(project?.status) === 'active'
    );

    const missingByProject = activeProjects.map((project) => {
        const requiredSkills = new Set(
            (Array.isArray(project?.roles) ? project.roles : [])
                .flatMap((role) => (Array.isArray(role?.skills) ? role.skills : []))
                .map((skill) => String(skill || '').trim())
                .filter(Boolean)
        );

        const missingSkills = [...requiredSkills].filter(
            (skill) => !mySkills.has(String(skill || '').trim().toLowerCase())
        );

        return {
            projectId: String(project?._id || ''),
            missingSkills,
        };
    });

    const impactedProjects = missingByProject.filter((item) => item.missingSkills.length > 0).length;
    const uniqueMissingSkills = Array.from(
        new Set(missingByProject.flatMap((item) => item.missingSkills))
    );

    return {
        impactedProjects,
        missingSkills: uniqueMissingSkills.slice(0, 10),
    };
}

// @desc    Get user's GitHub repositories
// @route   GET /api/user/github/repos
// @access  Private
router.get('/github/repos', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user || (!user.githubUsername && !user.githubId)) {
            return res.status(404).json({ error: 'GitHub account not connected' });
        }

        const githubUsername = await resolveGitHubUsername(user);

        if (!githubUsername) {
            return res.status(404).json({ error: 'GitHub username not found. Please reconnect GitHub.' });
        }

        const repos = await fetchGitHubJson(
            `/users/${encodeURIComponent(githubUsername)}/repos?sort=updated&per_page=100`,
            { Accept: 'application/vnd.github+json' }
        );

        const formattedRepos = (Array.isArray(repos) ? repos : []).map(formatGitHubRepo);

        res.json(formattedRepos);

    } catch (error) {
        console.error('Get GitHub repos error:', error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message || 'Server error' });
    }
});

// @desc    Get complete GitHub summary for connected user
// @route   GET /api/user/github/summary
// @access  Private
router.get('/github/summary', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user || (!user.githubUsername && !user.githubId)) {
            return res.status(404).json({ error: 'GitHub account not connected' });
        }

        const githubUsername = await resolveGitHubUsername(user);
        if (!githubUsername) {
            return res.status(404).json({ error: 'GitHub username not found. Please reconnect GitHub.' });
        }

        const summary = await buildGitHubSummaryForUser(user, githubUsername);
        res.json(summary);
    } catch (error) {
        console.error('Get GitHub summary error:', error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message || 'Server error' });
    }
});

// @desc    Get complete GitHub summary for a teammate
// @route   GET /api/user/:userId/github/summary
// @access  Private
router.get('/:userId/github/summary', protect, async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.userId);
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const storedSummary = getStoredGitHubSummary(targetUser);
        if (storedSummary) {
            return res.json(storedSummary);
        }

        if (!targetUser.githubUsername && !targetUser.githubId) {
            return res.status(404).json({ error: 'GitHub account not connected for this user' });
        }

        const githubUsername = await resolveGitHubUsername(targetUser);
        if (!githubUsername) {
            return res.status(404).json({ error: 'GitHub username not found for this user' });
        }

        // Cache miss: fetch once from GitHub, persist in MongoDB, and return.
        const summary = await buildGitHubSummaryForUser(targetUser, githubUsername);
        return res.json(summary);
    } catch (error) {
        if (error?.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid user id' });
        }
        console.error('Get teammate GitHub summary error:', error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message || 'Server error' });
    }
});

// @desc    Get dashboard summary for current user
// @route   GET /api/user/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select(
            'name email age qualifications role bio location website skills interests githubId githubUsername'
        );

        if (!currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [projects, pendingInvitesCount, candidates] = await Promise.all([
            Project.find({
                $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
            })
                .sort({ updatedAt: -1 })
                .limit(50),
            Notification.countDocuments({
                recipient: req.user._id,
                type: 'project_invite',
                status: 'pending',
            }),
            User.find({ _id: { $ne: req.user._id } })
                .select('name email role skills')
                .limit(80),
        ]);

        const mappedProjects = projects.map((project) => mapDashboardProject(project, req.user._id));
        const activeProjects = mappedProjects.filter((project) => project.type === 'active');
        const pendingProjects = mappedProjects.filter((project) => project.type === 'pending');
        const completedProjects = mappedProjects.filter((project) => project.type === 'completed');

        const suggestedMatches = buildSuggestedMatches(currentUser, candidates);
        const skillGaps = buildSkillGapSummary(currentUser, projects);

        return res.json({
            user: {
                id: String(currentUser._id),
                name: currentUser.name || currentUser.email || 'Developer',
                role: currentUser.role || 'Member',
            },
            stats: {
                activeProjects: activeProjects.length,
                pendingProjects: pendingProjects.length,
                completedProjects: completedProjects.length,
                pendingInvites: pendingInvitesCount,
                suggestedMatches: suggestedMatches.length,
                profileCompletion: calculateProfileCompletion(currentUser),
            },
            activeProjects: activeProjects.slice(0, 8),
            suggestedMatches,
            skillGaps,
        });
    } catch (error) {
        console.error('Get dashboard summary error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.age = req.body.age || user.age;
            user.qualifications = req.body.qualifications || user.qualifications;
            user.role = req.body.role || user.role;
            user.bio = req.body.bio || user.bio;
            user.location = req.body.location || user.location;
            user.website = req.body.website || user.website;

            if (req.body.skills) user.skills = req.body.skills;
            if (req.body.interests) user.interests = req.body.interests;
            if (req.body.availability) user.availability = req.body.availability;

            // Mark onboarding as completed if basic info is present
            if (user.name && user.age && user.qualifications) {
                user.onboardingCompleted = true;
            } else if (req.body.onboardingCompleted) {
                user.onboardingCompleted = req.body.onboardingCompleted;
            }

            const updatedUser = await user.save();

            res.json({
                user: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    age: updatedUser.age,
                    qualifications: updatedUser.qualifications,
                    role: updatedUser.role,
                    bio: updatedUser.bio,
                    location: updatedUser.location,
                    website: updatedUser.website,
                    githubConnected: Boolean(updatedUser.githubId),
                    githubUsername: updatedUser.githubUsername,
                    githubProfileReadme: updatedUser.githubProfileReadme || null,
                    googleConnected: Boolean(updatedUser.googleId),
                    skills: updatedUser.skills,
                    interests: updatedUser.interests,
                    availability: updatedUser.availability,
                    onboardingCompleted: updatedUser.onboardingCompleted,
                    createdAt: updatedUser.createdAt
                }
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                qualifications: user.qualifications,
                role: user.role,
                bio: user.bio,
                location: user.location,
                website: user.website,
                githubConnected: Boolean(user.githubId),
                githubUsername: user.githubUsername,
                githubProfileReadme: user.githubProfileReadme || null,
                googleConnected: Boolean(user.googleId),
                skills: user.skills,
                interests: user.interests,
                availability: user.availability,
                onboardingCompleted: user.onboardingCompleted,
                createdAt: user.createdAt
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @desc    Get teammate profile by id
// @route   GET /api/user/:userId/profile
// @access  Private
router.get('/:userId/profile', protect, async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.userId).select('-passwordHash');
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({
            id: targetUser._id,
            name: targetUser.name,
            email: targetUser.email,
            age: targetUser.age,
            qualifications: targetUser.qualifications,
            role: targetUser.role,
            bio: targetUser.bio,
            location: targetUser.location,
            website: targetUser.website,
            githubConnected: Boolean(targetUser.githubId || targetUser.githubUsername),
            githubUsername: targetUser.githubUsername,
            githubProfileReadme: targetUser.githubProfileReadme || null,
            githubSummaryCache: targetUser.githubSummaryCache || null,
            googleConnected: Boolean(targetUser.googleId),
            skills: targetUser.skills,
            interests: targetUser.interests,
            availability: targetUser.availability,
            onboardingCompleted: targetUser.onboardingCompleted,
            experienceLevel: targetUser.experienceLevel,
            availabilityStatus: targetUser.availabilityStatus,
            createdAt: targetUser.createdAt,
        });
    } catch (error) {
        if (error?.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid user id' });
        }
        console.error('Get teammate profile error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// @desc    Search all users
// @route   GET /api/user?search=
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { search, skills, availability, experience } = req.query;

        const query = { _id: { $ne: req.user._id } };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } }
            ];
        }

        if (skills) {
            const skillsArray = skills.split(',').filter(s => s.trim() !== '');
            if (skillsArray.length > 0) {
                // Find users who have at least one of the selected skills
                query.skills = { $in: skillsArray.map(s => new RegExp(`^${s}$`, 'i')) };
            }
        }

        if (availability) {
            const availabilityArray = availability.split(',').filter(s => s.trim() !== '');
            if (availabilityArray.length > 0) {
                query.availabilityStatus = { $in: availabilityArray };
            }
        }

        if (experience) {
            const experienceArray = experience.split(',').filter(s => s.trim() !== '');
            if (experienceArray.length > 0) {
                query.experienceLevel = { $in: experienceArray };
            }
        }

        const users = await User.find(query).select('-passwordHash -googleId -githubSummaryCache -githubProfileReadme');
        const sanitizedUsers = users.map((user) => {
            const plainUser = user.toObject();
            const { githubId, ...rest } = plainUser;
            return {
                ...rest,
                githubConnected: Boolean(githubId || plainUser.githubUsername),
            };
        });
        res.json(sanitizedUsers);
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
