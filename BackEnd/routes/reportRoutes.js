const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

const router = express.Router();

// STEP 1: Upload to a TEMP folder first
const upload = multer({ dest: 'uploads/temp/' });

router.post('/submit-report', upload.single('image'), (req, res) => {
 // Use AI classification for category/table selection
const allowedCategories = ['pothole', 'garbage', 'others'];

let category = '';
if (req.body.category && typeof req.body.category === 'string' && allowedCategories.includes(req.body.category.trim().toLowerCase())) {
  category = req.body.category.trim().toLowerCase();
} else if (req.body.classification && typeof req.body.classification === 'string' && allowedCategories.includes(req.body.classification.trim().toLowerCase())) {
  category = req.body.classification.trim().toLowerCase();
} else {
  category = 'others';
}


  // STEP 2: Create the destination directory if it doesn't exist
  const destDir = path.join(__dirname, '..', 'uploads', category);
  fs.mkdirSync(destDir, { recursive: true });

  // STEP 3: Move the file to correct folder with proper filename
  const ext = path.extname(req.file.originalname);
  const newFilename = `${Date.now()}${ext}`;
  const newPath = path.join(destDir, newFilename);

  fs.rename(req.file.path, newPath, (err) => {
    if (err) {
      console.error('❌ File move error:', err);
      return res.status(500).json({ error: 'Failed to move image' });
    }

    // Always store image_url as 'uploads/<category>/<filename>'
    const image_url = `uploads/${category}/${newFilename}`;

    const {
      location_lat,
      location_lng,
      address,
      description,
      urgency,
      contact,
      classification
    } = req.body;

    const table = `${category}_reports`;

   const query = `INSERT INTO \`${table}\` (location_lat, location_lng, address, description, urgency, contact, image_url, classification) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;



    const values = [
      location_lat,
      location_lng,
      address,
      description,
      urgency,
      contact,
      image_url,
      classification
    ];
console.log('Inserting into table:', table);

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('🔥 DB insert error:', err);
        return res.status(500).json({ error: err.message });
      }

      res.status(200).send('Report submitted successfully');
    });
  });
});

// GET /api/reports?category=garbage|pothole|others
router.get('/reports', (req, res) => {
  const allowedCategories = ['pothole', 'garbage', 'others'];
  const { category } = req.query;

  // Helper to map DB rows to frontend format
  const mapRow = (row, category) => ({
    id: row.id ? String(row.id) : undefined,
    title: row.description ? row.description.slice(0, 30) + (row.description.length > 30 ? '...' : '') : 'Civic Issue',
    description: row.description,
    location: row.address,
    urgency: row.urgency,
    status: row.status || 'pending',
    reportedBy: row.contact || 'Anonymous',
    reportedAt: row.created_at || '',
    category,
    hasImages: !!row.image_url,
    images: row.image_url ? [row.image_url] : [],
    location_lat: row.location_lat,
    location_lng: row.location_lng,
    classification: row.classification || category
  });

  const fetchCategory = (cat) => {
    return new Promise((resolve, reject) => {
      const table = `${cat}_reports`;
      db.query(`SELECT * FROM \`${table}\``, (err, results) => {
        if (err) return reject(err);
        resolve(results.map(row => mapRow(row, cat)));
      });
    });
  };

  if (category && allowedCategories.includes(category)) {
    fetchCategory(category)
      .then(data => res.json(data))
      .catch(err => {
        console.error('🔥 DB fetch error:', err);
        res.status(500).json({ error: err.message });
      });
  } else {
    // Fetch all categories in parallel
    Promise.all(allowedCategories.map(fetchCategory))
      .then(results => res.json([].concat(...results)))
      .catch(err => {
        console.error('🔥 DB fetch error:', err);
        res.status(500).json({ error: err.message });
      });
  }
});

// PATCH /api/reports/:category/:id - update status
router.patch('/reports/:category/:id', (req, res) => {
  const allowedCategories = ['pothole', 'garbage', 'others'];
  const { category, id } = req.params;
  const { status } = req.body;
  console.log('PATCH /reports:', { category, id, status });
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  const table = `${category}_reports`;
  db.query(`UPDATE \`${table}\` SET status = ? WHERE id = ?`, [status, id], (err, result) => {
    if (err) {
      console.error('🔥 DB update error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// DELETE /api/reports/:category/:id - delete issue
router.delete('/reports/:category/:id', (req, res) => {
  const allowedCategories = ['pothole', 'garbage', 'others'];
  const { category, id } = req.params;
  console.log('DELETE /reports:', { category, id });
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  const table = `${category}_reports`;
  db.query(`DELETE FROM \`${table}\` WHERE id = ?`, [id], (err, result) => {
    if (err) {
      console.error('🔥 DB delete error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

module.exports = router;
