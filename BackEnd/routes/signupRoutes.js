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

              // Create tax profiles
              if (taxType === 'both') {
                // Create a property tax profile
                db.query('INSERT INTO tax_profiles (user_id, tax_type, created_at) VALUES (?, ?, NOW())', [userId, 'property'], (tpErr1, tpRes1) => {
                  if (tpErr1) {
                    console.error('Insert property tax_profile error:', tpErr1);
                    return res.status(500).json({ error: 'Internal server error' });
                  }
                  const propertyTaxProfileId = tpRes1.insertId;
                  // Attach property profile
                  db.query(
                    'INSERT INTO property_profiles (tax_profile_id, land_area_sqft, kitta_no, building_area_sqft, uses, location_type) VALUES (?, ?, ?, ?, ?, ?)',
                    [propertyTaxProfileId, land_area_sqft || 0, kitta_no || '', building_area_sqft || 0, uses, location_type],
                    (ppErr) => {
                      if (ppErr) {
                        console.error('Insert property profile error:', ppErr);
                        return res.status(500).json({ error: 'Internal server error' });
                      }
                      // Create a business tax profile
                      db.query('INSERT INTO tax_profiles (user_id, tax_type, created_at) VALUES (?, ?, NOW())', [userId, 'business'], (tpErr2, tpRes2) => {
                        if (tpErr2) {
                          console.error('Insert business tax_profile error:', tpErr2);
                          return res.status(500).json({ error: 'Internal server error' });
                        }
                        const businessTaxProfileId = tpRes2.insertId;
                        // Attach business profile
                        db.query(
                          'INSERT INTO business_profiles (tax_profile_id, category, pan_no) VALUES (?, ?, ?)',
                          [businessTaxProfileId, category, pan_no],
                          (bpErr) => {
                            if (bpErr) {
                              console.error('Insert business profile error:', bpErr);
                              return res.status(500).json({ error: 'Internal server error' });
                            }
                            return res.json({ success: true, userId });
                          }
                        );
                      });
                    }
                  );
                });
              } else {
                // Create a single tax profile based on taxType
                db.query(
                  'INSERT INTO tax_profiles (user_id, tax_type, created_at) VALUES (?, ?, NOW())',
                  [userId, taxType],
                  (err2, taxResult) => {
                    if (err2) {
                      console.error('Insert tax_profiles error:', err2);
                      return res.status(500).json({ error: 'Internal server error' });
                    }
                    const taxProfileId = taxResult.insertId;
                    const finalize = () => res.json({ success: true, userId });
                    if (taxType === 'property') {
                      db.query(
                        'INSERT INTO property_profiles (tax_profile_id, land_area_sqft, kitta_no, building_area_sqft, uses, location_type) VALUES (?, ?, ?, ?, ?, ?)',
                        [taxProfileId, land_area_sqft || 0, kitta_no || '', building_area_sqft || 0, uses, location_type],
                        (ppErr) => {
                          if (ppErr) {
                            console.error('Insert property error:', ppErr);
                            return res.status(500).json({ error: 'Internal server error' });
                          }
                          finalize();
                        }
                      );
                    } else if (taxType === 'business') {
                      db.query(
                        'INSERT INTO business_profiles (tax_profile_id, category, pan_no) VALUES (?, ?, ?)',
                        [taxProfileId, category, pan_no],
                        (bpErr) => {
                          if (bpErr) {
                            console.error('Insert business error:', bpErr);
                            return res.status(500).json({ error: 'Internal server error' });
                          }
                          finalize();
                        }
                      );
                    } else {
                      finalize();
                    }
                  }
                );
              }
              
            }
          );
        }
      );
    });
  });
});

module.exports = router;
