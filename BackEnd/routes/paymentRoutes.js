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
      'SELECT id, assessment_amount, status FROM tax_records WHERE id = ? LIMIT 1',
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
          'UPDATE tax_records SET status = "paid", paid_at = NOW() WHERE id = ?',
          [taxRecordId],
          (updErr) => {
            if (updErr) {
              console.error("DB error updating payment status:", updErr);
              return res.status(500).send("Internal server error");
            }
            const redirectBase = process.env.FRONTEND_URL || 'http://localhost:8080';
            const amountParam = total_amount ? `&amount=${encodeURIComponent(total_amount)}` : '';
            return res.redirect(`${redirectBase}/pay-taxes?status=success&txn=${encodeURIComponent(transaction_uuid)}${amountParam}`);
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

module.exports = router;
