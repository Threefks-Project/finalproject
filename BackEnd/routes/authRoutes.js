const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

// POST /api/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Find user by username
  const findUserSql = `
    SELECT u.id, u.name, u.email, c.password_hash
    FROM users u
    JOIN credentials c ON c.user_id = u.id
    WHERE c.username = ?
    LIMIT 1
  `;

  db.query(findUserSql, [username], (err, results) => {
    if (err) {
      console.error('Login query error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password_hash, (bcryptErr, isMatch) => {
      if (bcryptErr) {
        console.error('Bcrypt compare error:', bcryptErr);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Minimal token-less auth for now; frontend stores user
      return res.json({
        success: true,
        user: {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: 'citizen',
        },
      });
    });
  });
});

module.exports = router;


