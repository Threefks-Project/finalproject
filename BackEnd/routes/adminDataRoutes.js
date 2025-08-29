const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/admin/citizens - list users with role citizen
router.get('/admin/citizens', (req, res) => {
  const sql = 'SELECT id, name, email, ward, phone, created_at FROM users ORDER BY id DESC';
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    res.json(rows.map(r => ({
      id: String(r.id),
      name: r.name,
      email: r.email,
      ward: r.ward,
      phone: r.phone,
      registeredAt: r.created_at,
    })));
  });
});

// GET /api/admin/tax-records - list tax records joined with user and profile
router.get('/admin/tax-records', (req, res) => {
  const sql = `
    SELECT tr.id, tr.fiscal_year, tr.assessment_amount, tr.due_date, tr.status,
           u.name AS citizenName, tp.tax_type
    FROM tax_records tr
    JOIN tax_profiles tp ON tp.id = tr.tax_profile_id
    JOIN users u ON u.id = tp.user_id
    ORDER BY tr.due_date DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.json([]);
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
    const data = rows.map(r => ({
      id: String(r.id),
      citizenName: r.citizenName,
      taxType: r.tax_type === 'business' ? 'Business Tax' : 'Property Tax',
      amount: Number(r.assessment_amount),
      dueDate: r.due_date,
      fiscalYear: r.fiscal_year,
      status: r.status,
    }));
    // Remove duplicates for the same tax_profile + fiscal_year keeping the paid one if exists
    // This safeguards UI in case any duplicates slipped in historically.
    // Since we don't have tax_profile_id in the response, we dedupe by (citizenName, taxType, fiscalYear)
    const seen = new Map();
    for (const r of data) {
      const key = `${r.citizenName}|${r.taxType}|${r.fiscalYear}`;
      if (!seen.has(key)) {
        seen.set(key, r);
      } else {
        const prev = seen.get(key);
        // Prefer paid over pending/overdue
        const score = (s) => (s === 'paid' ? 2 : s === 'overdue' ? 1 : 0);
        if (score(r.status) > score(prev.status)) {
          seen.set(key, r);
        }
      }
    }
    res.json(Array.from(seen.values()));
  });
});

// GET /api/admin/contacts - list contact messages
router.get('/admin/contacts', (req, res) => {
  const sql = 'SELECT id, name, email, phone, subject, message, created_at FROM contact_messages ORDER BY id DESC';
  db.query(sql, (err, rows) => {
    if (err) {
      if (err.code === 'ER_NO_SUCH_TABLE') return res.json([]);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// DELETE /api/admin/contacts/:id
router.delete('/admin/contacts/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM contact_messages WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    res.json({ success: true });
  });
});

// DELETE /api/admin/citizens/:id
router.delete('/admin/citizens/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    res.json({ success: true });
  });
});

module.exports = router;
// Extend router with contacts endpoint here (kept separate for clarity in contactRoutes)


