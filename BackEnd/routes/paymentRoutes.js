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

      // eSewa v2 config
      const esewaConfig = {
        amount: Number(amount).toFixed(2),                // ✅ required
        tax_amount: "0",
        product_service_charge: "0",
        product_delivery_charge: "0",
        total_amount: Number(amount).toFixed(2),          // ✅ must equal sum
        transaction_uuid: transactionUuid,
        product_code: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST",
        success_url: `${process.env.BASE_URL}/pay/esewa/success`,
        failure_url: `${process.env.BASE_URL}/pay/esewa/failure`,
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
  const { transaction_uuid } = req.query;
  if (!transaction_uuid) return res.status(400).send("Invalid");

  const parts = String(transaction_uuid).split("-");
  const taxRecordId = Number(parts[1]);
  if (!taxRecordId) return res.status(400).send("Invalid Transaction UUID");

  db.query(
    "UPDATE tax_records SET status = 'paid' WHERE id = ?",
    [taxRecordId],
    (err) => {
      if (err) return res.status(500).send("Server error");
      res.send("Payment successful. You can close this window.");
    }
  );
});

// Failure callback
router.get("/pay/esewa/failure", (req, res) => {
  res.status(400).send("Payment failed or cancelled.");
});

module.exports = router;
