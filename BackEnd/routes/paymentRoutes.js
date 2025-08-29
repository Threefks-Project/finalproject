const express = require("express");
const crypto = require("crypto");
const db = require("../db");
require("dotenv").config();

const router = express.Router();

// Utility to generate HMAC-SHA256 signature (base64)
function generateEsewaSignature(secretKey, signatureString) {
  return crypto
    .createHmac("sha256", secretKey)
    .update(signatureString)
    .digest("base64");
}

// eSewa UAT endpoints (New API)
router.post("/pay/esewa/initiate", (req, res) => {
  const { tax_record_id, amount } = req.body || {};
  if (!tax_record_id || !amount) {
    return res
      .status(400)
      .json({ error: "tax_record_id and amount are required" });
  }

  // Validate record exists and is pending
  db.query(
    'SELECT id FROM tax_records WHERE id = ? AND status = "pending" LIMIT 1',
    [tax_record_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Internal server error" });
      if (!rows || rows.length === 0)
        return res
          .status(404)
          .json({ error: "Record not found or not payable" });

      // Generate transaction UUID
      const transactionUuid = `TRX-${tax_record_id}-${Date.now()}`;

      // Build callback base to ensure it includes /api
      const baseUrl = process.env.BASE_URL || "http://localhost:3000";
      const callbackBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

      // eSewa v2 config
      const esewaConfig = {
        amount: Number(amount).toFixed(2),                // ✅ required
        tax_amount: "0",
        product_service_charge: "0",
        product_delivery_charge: "0",
        total_amount: Number(amount).toFixed(2),          // ✅ must equal sum
        transaction_uuid: transactionUuid,
        product_code: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST",
        success_url: `${callbackBase}/pay/esewa/success`,
        failure_url: `${callbackBase}/pay/esewa/failure`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
      };

      // Signature (only on signed fields)
      const signatureString =
        `total_amount=${esewaConfig.total_amount},` +
        `transaction_uuid=${esewaConfig.transaction_uuid},` +
        `product_code=${esewaConfig.product_code}`;

      const signature = generateEsewaSignature(
        process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q",
        signatureString
      );

      return res.json({
        esewa: {
          ...esewaConfig,
          signature,
        },
        formAction: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      });
    }
  );
});

// Success callback
router.get("/pay/esewa/success", (req, res) => {
  const { data } = req.query;
  if (!data) return res.status(400).send("Invalid request");

  try {
    const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
    const { transaction_uuid, status, total_amount } = decoded || {};

    if (!transaction_uuid) return res.status(400).send("Missing transaction_uuid");

    // transaction_uuid format: TRX-<tax_record_id>-<timestamp>
    const parts = String(transaction_uuid).split("-");
    const taxRecordId = parts.length >= 3 ? Number(parts[1]) : NaN;
    if (!taxRecordId || Number.isNaN(taxRecordId)) {
      return res.status(400).send("Invalid transaction reference");
    }

    db.query(
      'SELECT id, assessment_amount, status, tax_profile_id, fiscal_year FROM tax_records WHERE id = ? LIMIT 1',
      [taxRecordId],
      (selErr, rows) => {
        if (selErr) {
          console.error("DB error fetching record:", selErr);
          return res.status(500).send("Internal server error");
        }
        if (!rows || rows.length === 0) {
          return res.status(404).send("Record not found");
        }

        const isSuccess = String(status || '').toUpperCase() === 'COMPLETE' || String(status || '').toUpperCase() === 'SUCCESS';
        if (!isSuccess) {
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/pay-taxes?status=failure&txn=${encodeURIComponent(transaction_uuid)}`);
        }

        db.query(
          'UPDATE tax_records SET status = "paid" WHERE id = ?',
          [taxRecordId],
          (updErr) => {
            if (updErr) {
              console.error("DB error updating payment status:", updErr);
              return res.status(500).send("Internal server error");
            }
            // Clean up any duplicate pending records for the same profile/year
            const { tax_profile_id, fiscal_year } = rows[0];
            if (tax_profile_id && fiscal_year) {
              db.query(
                'DELETE FROM tax_records WHERE tax_profile_id = ? AND fiscal_year = ? AND status = "pending" AND id <> ?',
                [tax_profile_id, fiscal_year, taxRecordId],
                () => {
                  const redirectBase = process.env.FRONTEND_URL || 'http://localhost:8080';
                  const amountParam = total_amount ? `&amount=${encodeURIComponent(total_amount)}` : '';
                  return res.redirect(`${redirectBase}/pay-taxes?status=success&txn=${encodeURIComponent(transaction_uuid)}${amountParam}`);
                }
              );
            } else {
              const redirectBase = process.env.FRONTEND_URL || 'http://localhost:8080';
              const amountParam = total_amount ? `&amount=${encodeURIComponent(total_amount)}` : '';
              return res.redirect(`${redirectBase}/pay-taxes?status=success&txn=${encodeURIComponent(transaction_uuid)}${amountParam}`);
            }
          }
        );
      }
    );
  } catch (err) {
    console.error("Error parsing eSewa success data:", err);
    res.status(400).send("Invalid success data");
  }
});

// Failure callback
router.get("/pay/esewa/failure", (req, res) => {
  const { data } = req.query;
  if (!data) return res.status(400).send("Invalid request");

  try {
    const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
    const { transaction_uuid, status } = decoded || {};

    const redirectBase = process.env.FRONTEND_URL || 'http://localhost:8080';
    res.redirect(`${redirectBase}/pay-taxes?status=failure&txn=${encodeURIComponent(transaction_uuid || '')}`);
  } catch (err) {
    console.error("Error parsing eSewa failure data:", err);
    res.status(400).send("Invalid failure data");
  }
});

// PDF Receipt download for a tax record
const PDFDocument = require('pdfkit');
router.get('/tax/records/:id/receipt', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT tr.id, tr.fiscal_year, tr.assessment_amount, tr.due_date, tr.status,
           tp.tax_type, u.name AS user_name, u.email AS user_email, u.ward, u.phone
    FROM tax_records tr
    JOIN tax_profiles tp ON tp.id = tr.tax_profile_id
    JOIN users u ON u.id = tp.user_id
    WHERE tr.id = ?
    LIMIT 1`;
  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).send('Internal server error');
    if (!rows || rows.length === 0) return res.status(404).send('Not found');
    const r = rows[0];

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${r.id}.pdf"`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .fillColor('#0f172a')
      .text('Municipality Tax Payment Receipt', { align: 'center' })
      .moveDown(0.5);
    doc
      .fontSize(10)
      .fillColor('#64748b')
      .text(`Receipt ID: ${r.id}`, { align: 'center' })
      .moveDown(1);

    // Payer & record info
    doc.fontSize(12).fillColor('#0f172a').text('Payer Details', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor('#111827');
    doc.text(`Name: ${r.user_name}`);
    doc.text(`Email: ${r.user_email}`);
    doc.text(`Ward: ${r.ward || '-'}`);
    doc.text(`Phone: ${r.phone || '-'}`);

    doc.moveDown(0.8);
    doc.fontSize(12).fillColor('#0f172a').text('Payment Details', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor('#111827');
    doc.text(`Tax Type: ${r.tax_type === 'business' ? 'Business Tax' : 'Property Tax'}`);
    doc.text(`Fiscal Year: ${r.fiscal_year}`);
    doc.text(`Amount: NPR ${Number(r.assessment_amount).toFixed(2)}`);
    doc.text(`Due Date: ${r.due_date ? new Date(r.due_date).toISOString().slice(0,10) : '-'}`);
    doc.text(`Status: ${r.status}`);

    doc.moveDown(1);
    doc.fontSize(10).fillColor('#6b7280').text('Issued by Municipality e-Governance System', { align: 'center' });
    doc.text(`Issued At: ${new Date().toLocaleString()}`, { align: 'center' });

    doc.end();
  });
});

module.exports = router;
