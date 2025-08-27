// routes/signupRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db'); // make sure this exports your mysql connection

router.post('/signup', (req, res) => {
  const form = req.body;
  const { name, ward, phone, email, taxType, land_area_sqft, kitta_no, building_area_sqft, uses, location_type, category, pan_no, username, password } = form;

  // Basic validation
  if (!name || !ward || !phone || !email || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if email already exists
  db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Email check error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Hash error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Insert into users
      db.query(
        'INSERT INTO users (name, ward, phone, email, created_at) VALUES (?, ?, ?, ?, NOW())',
        [name, ward, phone, email],
        (err, userResult) => {
          if (err) {
            console.error('Insert user error:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          const userId = userResult.insertId;

          // Insert into credentials
          db.query(
            'INSERT INTO credentials (user_id, username, password_hash, created_at) VALUES (?, ?, ?, NOW())',
            [userId, username, hash],
            (err) => {
              if (err) {
                console.error('Insert credentials error:', err);
                return res.status(500).json({ error: 'Internal server error' });
              }

              // Insert into tax_profiles
              db.query(
                'INSERT INTO tax_profiles (user_id, tax_type, created_at) VALUES (?, ?, NOW())',
                [userId, taxType],
                (err, taxResult) => {
                  if (err) {
                    console.error('Insert tax_profiles error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                  }
              
                  const taxProfileId = taxResult.insertId;
              
                  // Insert property if needed
                  const insertProperty = (callback) => {
                    if (taxType === 'property' || taxType === 'both') {
                      db.query(
                        'INSERT INTO property_profiles (tax_profile_id, land_area_sqft, kitta_no, building_area_sqft, uses, location_type) VALUES (?, ?, ?, ?, ?, ?)',
                        [taxProfileId, land_area_sqft, kitta_no, building_area_sqft, uses, location_type],
                        callback
                      );
                    } else callback(null);
                  };
              
                  // Insert business if needed
                  const insertBusiness = (callback) => {
                    if (taxType === 'business' || taxType === 'both') {
                      db.query(
                        'INSERT INTO business_profiles (tax_profile_id, category,pan_no) VALUES (?, ?, ?)',
                        [taxProfileId, category,pan_no],
                        callback
                      );
                    } else callback(null);
                  };
              
                  // Insert property and business then return success
                  insertProperty((err) => {
                    if (err) {
                      console.error('Insert property error:', err);
                      return res.status(500).json({ error: 'Internal server error' });
                    }
              
                    insertBusiness((err) => {
                      if (err) {
                        console.error('Insert business error:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                      }
              
                      res.json({ success: true, userId });
                    });
                  });
                }
              );
              
            }
          );
        }
      );
    });
  });
});

module.exports = router;
