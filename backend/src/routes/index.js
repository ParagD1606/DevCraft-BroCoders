const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/auth', authRoutes);

router.get('/', (_req, res) => {
  res.status(200).json({
    message: 'API is up and running',
  });
});

module.exports = router;
