const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

async function fetchGitHubJson(path) {
    const response = await fetch(`https://api.github.com${path}`, {
        headers: {
            'User-Agent': 'DevCraft-BroCoders',
            'Accept': 'application/vnd.github.v3+json',
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

// @desc    Get user's GitHub repositories
// @route   GET /api/user/github/repos
// @access  Private
router.get('/github/repos', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user || (!user.githubUsername && !user.githubId)) {
            return res.status(404).json({ error: 'GitHub account not connected' });
        }

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

        if (!githubUsername) {
            return res.status(404).json({ error: 'GitHub username not found. Please reconnect GitHub.' });
        }

        const repos = await fetchGitHubJson(
            `/users/${encodeURIComponent(githubUsername)}/repos?sort=updated&per_page=100`
        );

        const formattedRepos = (Array.isArray(repos) ? repos : []).map((repo) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
        }));

        res.json(formattedRepos);

    } catch (error) {
        console.error('Get GitHub repos error:', error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message || 'Server error' });
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

        const users = await User.find(query).select('-passwordHash -githubId -googleId');
        res.json(users);
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
