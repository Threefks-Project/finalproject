const db = require('../db');

const getActiveTaxRates = () => new Promise((resolve, reject) => {
  const sql = `SELECT land_rate_per_sqft, building_rate_per_sqft, property_tax_rate, fixed_minimum
               FROM tax_rates
               ORDER BY effective_from DESC, id DESC
               LIMIT 1`;
  db.query(sql, (err, rows) => {
    if (err) return reject(err);
    if (!rows || rows.length === 0) return reject(new Error('No tax rates configured'));
    resolve(rows[0]);
  });
});

const getUsageFactor = (name) => new Promise((resolve, reject) => {
  if (!name) return resolve(1);
  const sql = 'SELECT factor FROM usage_types WHERE LOWER(name) = LOWER(?) LIMIT 1';
  db.query(sql, [name], (err, rows) => {
    if (err) return reject(err);
    resolve(rows && rows[0] ? Number(rows[0].factor) : 1);
  });
});

const getLocationFactor = (name) => new Promise((resolve, reject) => {
  if (!name) return resolve(1);
  const sql = 'SELECT factor FROM location_types WHERE LOWER(name) = LOWER(?) LIMIT 1';
  db.query(sql, [name], (err, rows) => {
    if (err) return reject(err);
    resolve(rows && rows[0] ? Number(rows[0].factor) : 1);
  });
});

// Business tax: fixed fee by category
const getBusinessFixedFee = (category) => new Promise((resolve, reject) => {
  if (!category) return resolve(0);
  const sql = 'SELECT fixed_fee FROM business_tax_categories WHERE LOWER(category) = LOWER(?) LIMIT 1';
  db.query(sql, [category], (err, rows) => {
    if (err) return reject(err);
    resolve(rows && rows[0] ? Number(rows[0].fixed_fee) : 0);
  });
});

function computeBusinessTax({ category, fixedFee }) {
  // If fixedFee provided, prefer it; else zero. Caller can fetch via getBusinessFixedFee.
  const amount = Number(fixedFee || 0);
  return {
    taxAmount: Number(amount.toFixed(2)),
  };
}

function computePropertyTax({ landAreaSqft = 0, buildingAreaSqft = 0, usageFactor = 1, locationFactor = 1, rates }) {
  const landComponent = Number(landAreaSqft) * Number(rates.land_rate_per_sqft);
  const buildingComponent = Number(buildingAreaSqft) * Number(rates.building_rate_per_sqft);
  const base = landComponent + buildingComponent;
  const adjustedBase = base * Number(usageFactor) * Number(locationFactor);
  const computed = adjustedBase * Number(rates.property_tax_rate);
  const amount = Math.max(Number(rates.fixed_minimum), computed);
  return {
    baseAmount: base,
    adjustedBase,
    taxAmount: Number(amount.toFixed(2)),
  };
}

const upsertCurrentDue = ({ taxProfileId, fiscalYear, assessmentAmount, dueDate }) => new Promise((resolve, reject) => {
  // If a paid record already exists for the fiscal year, do nothing
  const paidSql = 'SELECT id FROM tax_records WHERE tax_profile_id = ? AND fiscal_year = ? AND status = "paid" LIMIT 1';
  db.query(paidSql, [taxProfileId, fiscalYear], (paidErr, paidRows) => {
    if (paidErr) return reject(paidErr);
    if (paidRows && paidRows.length > 0) {
      return resolve(paidRows[0].id);
    }
    // Otherwise, upsert pending
    const findSql = 'SELECT id FROM tax_records WHERE tax_profile_id = ? AND fiscal_year = ? AND status = "pending" LIMIT 1';
    db.query(findSql, [taxProfileId, fiscalYear], (findErr, rows) => {
      if (findErr) return reject(findErr);
      if (rows && rows.length > 0) {
        const updateSql = 'UPDATE tax_records SET assessment_amount = ?, due_date = ? WHERE id = ?';
        db.query(updateSql, [assessmentAmount, dueDate, rows[0].id], (updErr) => {
          if (updErr) return reject(updErr);
          resolve(rows[0].id);
        });
      } else {
        const insertSql = 'INSERT INTO tax_records (tax_profile_id, fiscal_year, assessment_amount, due_date, status, created_at) VALUES (?, ?, ?, ?, "pending", NOW())';
        db.query(insertSql, [taxProfileId, fiscalYear, assessmentAmount, dueDate], (insErr, result) => {
          if (insErr) return reject(insErr);
          resolve(result.insertId);
        });
      }
    });
  });
});

module.exports = {
  getActiveTaxRates,
  getUsageFactor,
  getLocationFactor,
  getBusinessFixedFee,
  computePropertyTax,
  computeBusinessTax,
  upsertCurrentDue,
};


    