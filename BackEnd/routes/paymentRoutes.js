const express = require('express');
const crypto = require('crypto');
const db = require('../db');

const router = express.Router();

// eSewa UAT endpoints
// Initiate payment: creates a payment record and returns the payload to post to eSewa
router.post('/pay/esewa/initiate', (req, res) => {
  const { tax_record_id, amount } = req.body || {};
  if (!tax_record_id || !amount) {
    return res.status(400).json({ error: 'tax_record_id and amount are required' });
  }
  // Validate exists and is pending
  db.query('SELECT id FROM tax_records WHERE id = ? AND status = "pending" LIMIT 1', [tax_record_id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Record not found or not payable' });

    // Generate reference id
    const referenceId = `TRX-${tax_record_id}-${Date.now()}`;

    // eSewa UAT parameters (merchant test credentials)
    const esewaConfig = {
      amt: Number(amount).toFixed(2),
      txAmt: '0',
      psc: '0',
      pdc: '0',
      tAmt: Number(amount).toFixed(2),
      pid: referenceId,
      scd: 'EPAYTEST', // eSewa UAT merchant code
      su: 'http://localhost:3000/api/pay/esewa/success',
      fu: 'http://localhost:3000/api/pay/esewa/failure',
    };

    return res.json({
      esewa: esewaConfig,
      formAction: 'https://uat.esewa.com.np/epay/main',
    });
  });
});

// Success callback: verify server-to-server if needed (UAT minimal)
router.get('/pay/esewa/success', (req, res) => {
  const { amt, refId, oid } = req.query; // eSewa returns refId, oid (pid), amt
  if (!oid) return res.status(400).send('Invalid');
  // Mark record as paid
  const taxRecordId = Number(String(oid).split('-')[1]);
  if (!taxRecordId) return res.status(400).send('Invalid OID');
  db.query('UPDATE tax_records SET status = "paid" WHERE id = ?', [taxRecordId], (err) => {
    if (err) return res.status(500).send('Server error');
    res.send('Payment successful. You can close this window.');
  });
});

router.get('/pay/esewa/failure', (req, res) => {
  res.status(400).send('Payment failed or cancelled.');
});

module.exports = router;


