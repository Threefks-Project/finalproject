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
const allowedCategories = ['pothole', 'garbage', 'waterleak'];

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

    const image_url = newPath.replace(/\\/g, '/');

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

module.exports = router;
