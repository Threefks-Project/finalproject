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
    res.json(rows.map(r => ({
      id: String(r.id),
      citizenName: r.citizenName,
      taxType: r.tax_type === 'business' ? 'Business Tax' : 'Property Tax',
      amount: Number(r.assessment_amount),
      dueDate: r.due_date,
      fiscalYear: r.fiscal_year,
      status: r.status,
    })));
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


