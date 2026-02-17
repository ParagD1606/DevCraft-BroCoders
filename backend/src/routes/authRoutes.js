const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersByEmail = new Map();
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
  if (usersByEmail.has(normalizedEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  usersByEmail.set(normalizedEmail, user);

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
  const user = usersByEmail.get(normalizedEmail);
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

module.exports = router;
