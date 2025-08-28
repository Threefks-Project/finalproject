const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

const router = express.Router();

// storage in uploads/gallery
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploads', 'gallery');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// POST /api/gallery - admin upload
router.post('/gallery', upload.single('image'), (req, res) => {
  try {
    const { title, description, date, location, category } = req.body || {};
    if (!req.file) return res.status(400).json({ error: 'image required' });
    const relPath = `uploads/gallery/${req.file.filename}`;
    const sql = 'INSERT INTO gallery (title, description, date, location, category, image_path, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';
    db.query(sql, [title || '', description || '', date || null, location || '', category || 'general', relPath], (err, result) => {
      if (err) {
        console.error('Gallery insert error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ success: true, id: result.insertId, image_path: relPath });
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/gallery - list
router.get('/gallery', (req, res) => {
  const sql = 'SELECT id, title, description, date, location, category, image_path FROM gallery ORDER BY id DESC';
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    res.json(rows.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      date: r.date,
      location: r.location,
      category: r.category,
      imageUrl: `/${r.image_path}`,
    })));
  });
});

module.exports = router;


