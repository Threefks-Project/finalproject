const express = require('express');
const db = require('../db');
const {
  getActiveTaxRates,
  getUsageFactor,
  getLocationFactor,
  computePropertyTax,
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
      // Compute and upsert property due if property profile exists
      const hasProperty = profileRows && profileRows[0] && (profileRows[0].tax_type === 'property' || profileRows[0].tax_type === 'both');

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

      if (hasProperty) {
        const pp = profileRows[0];
        Promise.all([
          getActiveTaxRates(),
          getUsageFactor(pp.uses),
          getLocationFactor(pp.location_type),
        ])
          .then(([rates, usageFactor, locationFactor]) => {
            const calc = computePropertyTax({
              landAreaSqft: pp.land_area_sqft || 0,
              buildingAreaSqft: pp.building_area_sqft || 0,
              usageFactor,
              locationFactor,
              rates,
            });
            const nextDue = new Date();
            nextDue.setMonth(nextDue.getMonth() + 1);
            const dueDateStr = nextDue.toISOString().slice(0, 10);
            const now = new Date();
            const fyStartMonth = 3; // April (0-indexed)
            const fyYearStart = now.getMonth() >= fyStartMonth ? now.getFullYear() : now.getFullYear() - 1;
            const fiscalYear = `${fyYearStart}-${fyYearStart + 1}`;
            return upsertCurrentDue({ taxProfileId: pp.tax_profile_id, fiscalYear, assessmentAmount: calc.taxAmount, dueDate: dueDateStr });
          })
          .then(() => performCalcAndRespond())
          .catch((err) => {
            console.error('Tax calc error:', err);
            // Even if calc fails, respond with current dues
            performCalcAndRespond();
          });
      } else {
        performCalcAndRespond();
      }
    });
  });
});

module.exports = router;


