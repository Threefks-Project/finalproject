const express = require('express');
const db = require('../db');
const {
  getActiveTaxRates,
  getUsageFactor,
  getLocationFactor,
  getBusinessFixedFee,
  computePropertyTax,
  computeBusinessTax,
  upsertCurrentDue,
} = require('../services/tax_calculator');

const router = express.Router();

// GET /api/taxpayer/:userId
router.get('/taxpayer/:userId', (req, res) => {
  const { userId } = req.params;

  const userSql = 'SELECT id, name, email, ward, phone FROM users WHERE id = ? LIMIT 1';
  db.query(userSql, [userId], (userErr, userRows) => {
    if (userErr) {
      console.error('User fetch error:', userErr);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileSql = `
      SELECT tp.id AS tax_profile_id, tp.tax_type,
             pp.land_area_sqft, pp.kitta_no, pp.building_area_sqft, pp.uses, pp.location_type,
             bp.category, bp.pan_no
      FROM tax_profiles tp
      LEFT JOIN property_profiles pp ON pp.tax_profile_id = tp.id
      LEFT JOIN business_profiles bp ON bp.tax_profile_id = tp.id
      WHERE tp.user_id = ?
    `;

    db.query(profileSql, [userId], (profileErr, profileRows) => {
      if (profileErr) {
        console.error('Profile fetch error:', profileErr);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const duesSql = `
        SELECT tr.id, tr.fiscal_year AS fiscalYear, tr.assessment_amount AS assessmentAmount, tr.due_date AS dueDate, tr.status, tp.tax_type AS taxType
        FROM tax_records tr
        JOIN tax_profiles tp ON tp.id = tr.tax_profile_id
        WHERE tp.user_id = ?
        ORDER BY tr.due_date DESC
      `;
      // Compute and upsert due for property and/or business depending on profile
      const taxType = profileRows && profileRows[0] ? profileRows[0].tax_type : null;
      const hasProperty = taxType === 'property' || taxType === 'both';
      const hasBusiness = taxType === 'business' || taxType === 'both';

      const performCalcAndRespond = () => {
        db.query(duesSql, [userId], (duesErr, duesRows) => {
          if (duesErr) {
            if (duesErr && duesErr.code === 'ER_NO_SUCH_TABLE') {
              return res.json({ user: userRows[0], profiles: profileRows || [], dues: [] });
            }
            console.error('Dues fetch error:', duesErr);
            return res.status(500).json({ error: 'Internal server error' });
          }
          return res.json({
            user: userRows[0],
            profiles: profileRows || [],
            dues: (duesRows || []).map((r) => ({
              id: String(r.id),
              type: r.taxType === 'business' ? 'Business Tax' : 'Property Tax',
              amount: Number(r.assessmentAmount),
              dueDate: r.dueDate,
              fiscalYear: r.fiscalYear,
              status: r.status,
            })),
          });
        });
      };

      if (hasProperty || hasBusiness) {
        const row = profileRows[0] || {};
        const propertyPromises = hasProperty
          ? [
              getActiveTaxRates(),
              getUsageFactor(row.uses),
              getLocationFactor(row.location_type),
            ]
          : [];
        const businessPromise = hasBusiness ? getBusinessFixedFee(row.category) : Promise.resolve(0);

        Promise.all([
          Promise.all(propertyPromises).catch(() => []),
          businessPromise.catch(() => 0),
        ])
          .then(([[rates, usageFactor, locationFactor] = [], businessFixedFee]) => {
            let totalAssessment = 0;
            if (hasProperty && rates) {
              const pCalc = computePropertyTax({
                landAreaSqft: row.land_area_sqft || 0,
                buildingAreaSqft: row.building_area_sqft || 0,
                usageFactor: usageFactor || 1,
                locationFactor: locationFactor || 1,
                rates,
              });
              totalAssessment += Number(pCalc.taxAmount || 0);
            }
            if (hasBusiness) {
              const bCalc = computeBusinessTax({ category: row.category, fixedFee: businessFixedFee || 0 });
              totalAssessment += Number(bCalc.taxAmount || 0);
            }

            const nextDue = new Date();
            nextDue.setMonth(nextDue.getMonth() + 1);
            const dueDateStr = nextDue.toISOString().slice(0, 10);
            const now = new Date();
            const fyStartMonth = 3; // April (0-indexed)
            const fyYearStart = now.getMonth() >= fyStartMonth ? now.getFullYear() : now.getFullYear() - 1;
            const fiscalYear = `${fyYearStart}-${fyYearStart + 1}`;
            const taxProfileId = row.tax_profile_id;
            if (!taxProfileId) return null;
            return upsertCurrentDue({ taxProfileId, fiscalYear, assessmentAmount: totalAssessment, dueDate: dueDateStr });
          })
          .then(() => performCalcAndRespond())
          .catch((err) => {
            console.error('Tax calc error:', err);
            performCalcAndRespond();
          });
      } else {
        performCalcAndRespond();
      }
    });
  });
});

// POST /api/taxpayer/:userId/property - add or update property profile
router.post('/taxpayer/:userId/property', (req, res) => {
  const { userId } = req.params;
  const { land_area_sqft, kitta_no, building_area_sqft, uses, location_type } = req.body || {};
  if (!uses || !location_type) {
    return res.status(400).json({ error: 'uses and location_type are required' });
  }
  // Ensure there is a tax_profile for property/both
  const getProfileSql = 'SELECT id, tax_type FROM tax_profiles WHERE user_id = ? LIMIT 1';
  db.query(getProfileSql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    const ensureProfile = (cb) => {
      if (!rows || rows.length === 0) {
        db.query('INSERT INTO tax_profiles (user_id, tax_type, created_at) VALUES (?, ?, NOW())', [userId, 'property'], (iErr, result) => {
          if (iErr) return cb(iErr);
          cb(null, { id: result.insertId, tax_type: 'property' });
        });
      } else {
        const profile = rows[0];
        if (profile.tax_type === 'business') {
          // upgrade to both
          db.query('UPDATE tax_profiles SET tax_type = ? WHERE id = ?', ['both', profile.id], (uErr) => {
            if (uErr) return cb(uErr);
            cb(null, { id: profile.id, tax_type: 'both' });
          });
        } else {
          cb(null, profile);
        }
      }
    };
    ensureProfile((pErr, profile) => {
      if (pErr) return res.status(500).json({ error: 'Internal server error' });
      // Upsert property_profiles
      db.query('SELECT id FROM property_profiles WHERE tax_profile_id = ? LIMIT 1', [profile.id], (sErr, pRows) => {
        if (sErr) return res.status(500).json({ error: 'Internal server error' });
        if (pRows && pRows.length > 0) {
          db.query(
            'UPDATE property_profiles SET land_area_sqft = ?, kitta_no = ?, building_area_sqft = ?, uses = ?, location_type = ? WHERE id = ?',
            [land_area_sqft || 0, kitta_no || '', building_area_sqft || 0, uses, location_type, pRows[0].id],
            (uErr) => {
              if (uErr) return res.status(500).json({ error: 'Internal server error' });
              res.json({ success: true, tax_profile_id: profile.id });
            }
          );
        } else {
          db.query(
            'INSERT INTO property_profiles (tax_profile_id, land_area_sqft, kitta_no, building_area_sqft, uses, location_type) VALUES (?, ?, ?, ?, ?, ?)',
            [profile.id, land_area_sqft || 0, kitta_no || '', building_area_sqft || 0, uses, location_type],
            (i2Err) => {
              if (i2Err) return res.status(500).json({ error: 'Internal server error' });
              res.json({ success: true, tax_profile_id: profile.id });
            }
          );
        }
      });
    });
  });
});

// POST /api/taxpayer/:userId/business - add or update business profile
router.post('/taxpayer/:userId/business', (req, res) => {
  const { userId } = req.params;
  const { category, pan_no } = req.body || {};
  if (!category || !pan_no) {
    return res.status(400).json({ error: 'category and pan_no are required' });
  }
  const getProfileSql = 'SELECT id, tax_type FROM tax_profiles WHERE user_id = ? LIMIT 1';
  db.query(getProfileSql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    const ensureProfile = (cb) => {
      if (!rows || rows.length === 0) {
        db.query('INSERT INTO tax_profiles (user_id, tax_type, created_at) VALUES (?, ?, NOW())', [userId, 'business'], (iErr, result) => {
          if (iErr) return cb(iErr);
          cb(null, { id: result.insertId, tax_type: 'business' });
        });
      } else {
        const profile = rows[0];
        if (profile.tax_type === 'property') {
          db.query('UPDATE tax_profiles SET tax_type = ? WHERE id = ?', ['both', profile.id], (uErr) => {
            if (uErr) return cb(uErr);
            cb(null, { id: profile.id, tax_type: 'both' });
          });
        } else {
          cb(null, profile);
        }
      }
    };
    ensureProfile((pErr, profile) => {
      if (pErr) return res.status(500).json({ error: 'Internal server error' });
      db.query('SELECT id FROM business_profiles WHERE tax_profile_id = ? LIMIT 1', [profile.id], (sErr, bRows) => {
        if (sErr) return res.status(500).json({ error: 'Internal server error' });
        if (bRows && bRows.length > 0) {
          db.query('UPDATE business_profiles SET category = ?, pan_no = ? WHERE id = ?', [category, pan_no, bRows[0].id], (uErr) => {
            if (uErr) return res.status(500).json({ error: 'Internal server error' });
            res.json({ success: true, tax_profile_id: profile.id });
          });
        } else {
          db.query('INSERT INTO business_profiles (tax_profile_id, category, pan_no) VALUES (?, ?, ?)', [profile.id, category, pan_no], (i2Err) => {
            if (i2Err) return res.status(500).json({ error: 'Internal server error' });
            res.json({ success: true, tax_profile_id: profile.id });
          });
        }
      });
    });
  });
});

module.exports = router;


