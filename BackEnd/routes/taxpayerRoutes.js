const express = require('express');
const db = require('../db');

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
        SELECT id, type, amount, due_date AS dueDate, status
        FROM tax_records
        WHERE user_id = ?
        ORDER BY due_date DESC
      `;

      db.query(duesSql, [userId], (duesErr, duesRows) => {
        if (duesErr) {
          // If dues table doesn't exist yet, return empty dues array gracefully
          if (duesErr && duesErr.code === 'ER_NO_SUCH_TABLE') {
            return res.json({
              user: userRows[0],
              profiles: profileRows || [],
              dues: [],
            });
          }
          console.error('Dues fetch error:', duesErr);
          return res.status(500).json({ error: 'Internal server error' });
        }

        return res.json({
          user: userRows[0],
          profiles: profileRows || [],
          dues: (duesRows || []).map((r) => ({
            id: String(r.id),
            type: r.type,
            amount: Number(r.amount),
            dueDate: r.dueDate,
            status: r.status,
          })),
        });
      });
    });
  });
});

module.exports = router;


