const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
const userRoutes = require('./userRoutes');
const chatRoutes = require('./chatRoutes');
const messageRoutes = require('./messageRoutes');

router.use('/user', userRoutes);
router.use('/chat', chatRoutes);
router.use('/message', messageRoutes);

router.get('/', (_req, res) => {
  res.status(200).json({
    message: 'API is up and running',
  });
});

module.exports = router;
