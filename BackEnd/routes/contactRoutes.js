const express = require('express');
const db = require('../db');

const router = express.Router();

// POST /api/contact - store contact form
router.post('/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = `INSERT INTO contact_messages (name, email, phone, subject, message, created_at)
               VALUES (?, ?, ?, ?, ?, NOW())`;
  db.query(sql, [name, email, phone || null, subject, message], (err, result) => {
    if (err) {
      console.error('Contact insert error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

module.exports = router;


