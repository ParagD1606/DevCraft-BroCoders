const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/User');
// const usersByEmail = new Map(); // Removed in-memory storage
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const router = express.Router();

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev_secret_change_me';
}

router.post('/signup', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Email, password, and confirmPassword are required' });
  }

  if (!EMAIL_REGEX.test(String(email).trim())) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const normalizedEmail = normalizeEmail(email);
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    email: normalizedEmail,
    passwordHash,
  });

  const token = jwt.sign({ sub: user.id, email: user.email }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  return res.status(201).json({
    message: 'Signup successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  return res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});


// GitHub OAuth Routes
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: 'http://localhost:5173/auth?error=github_failed' }),
  async (req, res) => {
    // req.user contains the profile returned by GitHub
    const profile = req.user;

    // Get email from profile
    // GitHub profile emails might be in emails array if private
    let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

    if (!email) {
      return res.redirect('http://localhost:5173/auth?error=no_email_from_github');
    }

    const normalizedEmail = normalizeEmail(email);
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user for GitHub login
      user = await User.create({
        email: normalizedEmail,
        githubId: profile.id,
      });
    }

    // Generate Token
    const token = jwt.sign({ sub: user.id, email: user.email }, getJwtSecret(), {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    // Redirect to frontend with token
    // In production, consider a more secure way (e.g., cookie or short-lived code exchanging for token)
    res.redirect(`http://localhost:5173/oauth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, email: user.email, createdAt: user.createdAt }))}`);
  }
);

module.exports = router;
