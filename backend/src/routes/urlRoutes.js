const express = require("express");
const { nanoid } = require("nanoid");
const db = require("../db/database");
const redis = require("../utils/redisClient");

const router = express.Router();

/* ---------------- URL VALIDATION ---------------- */
function isValidUrl(url) {
  return /^https?:\/\//i.test(url);
}

/* ---------------- CREATE SHORT URL ---------------- */
router.post("/shorten", (req, res) => {
  try {
    let { originalUrl, customCode, expiresIn } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    // ✅ Auto-fix missing protocol
    if (!isValidUrl(originalUrl)) {
      originalUrl = "https://" + originalUrl;
    }

    const shortCode = customCode?.trim() || nanoid(6);
    let expiresAt = null;

    if (expiresIn) {
      expiresAt = new Date(Date.now() + Number(expiresIn) * 1000).toISOString();
    }

    const existing = db
      .prepare("SELECT 1 FROM urls WHERE short_code = ?")
      .get(shortCode);

    if (existing) {
      return res.status(409).json({ error: "Short code already exists" });
    }

    db.prepare(
      "INSERT INTO urls (short_code, original_url, expires_at) VALUES (?, ?, ?)"
    ).run(shortCode, originalUrl, expiresAt);

    // ✅ Frontend will build full URL itself
    return res.json({ shortCode });
  } catch (err) {
    console.error("❌ Shorten error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/* ---------------- REDIRECT ---------------- */
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    // ✅ Redis cache (optional)
    if (redis?.isOpen) {
      const cached = await redis.get(code);
      if (cached) {
        return res.redirect(cached);
      }
    }

    const row = db
      .prepare(
        "SELECT original_url, expires_at FROM urls WHERE short_code = ?"
      )
      .get(code);

    if (!row) {
      return res.status(404).send("URL not found");
    }

    if (row.expires_at && new Date(row.expires_at) < new Date()) {
      return res.status(410).send("This link has expired");
    }

    if (redis?.isOpen) {
      await redis.set(code, row.original_url);
    }

    return res.redirect(row.original_url);
  } catch (err) {
    console.error("❌ Redirect error:", err);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
