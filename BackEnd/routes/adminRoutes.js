const express = require('express');

const router = express.Router();

// Simple admin login using env or defaults. Replace with DB check if needed.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

router.post('/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      user: {
        id: 'admin-1',
        name: 'System Administrator',
        email: 'admin@municipality.gov',
        role: 'admin',
      },
    });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

module.exports = router;


