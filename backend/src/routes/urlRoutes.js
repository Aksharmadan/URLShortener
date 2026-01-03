const express = require("express");
const { nanoid } = require("nanoid");
const db = require("../db/database"); // optional fallback
const redis = require("../utils/redisClient");

const BASE_URL =
  process.env.BASE_URL || "https://urlshortener-xxtz.onrender.com";

const router = express.Router();

/* SIMPLE URL VALIDATION */
function isValidUrl(url) {
  return /^https?:\/\//i.test(url);
}

/* ===========================
   CREATE SHORT URL
=========================== */
router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl, customCode, expiresIn } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({
        error: "Invalid URL. Must start with http:// or https://",
      });
    }

    const shortCode = customCode || nanoid(6);
    let ttlSeconds = null;

    if (expiresIn) {
      ttlSeconds = Number(expiresIn);
    }

    /* 🔴 REDIS = SOURCE OF TRUTH */
    const exists = await redis.get(shortCode);
    if (exists) {
      return res.status(409).json({ error: "Short code already exists" });
    }

    // Save to Redis
    if (ttlSeconds) {
      await redis.set(shortCode, originalUrl, { EX: ttlSeconds });
    } else {
      await redis.set(shortCode, originalUrl);
    }

    /* 🟡 Optional: save to SQLite (local dev / analytics only) */
    try {
      db.prepare(
        "INSERT INTO urls (short_code, original_url, expires_at) VALUES (?, ?, ?)"
      ).run(
        shortCode,
        originalUrl,
        ttlSeconds
          ? new Date(Date.now() + ttlSeconds * 1000).toISOString()
          : null
      );
    } catch (e) {
      // ignore DB errors in production
    }

    res.json({
      shortUrl: `${BASE_URL}/${shortCode}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ===========================
   REDIRECT SHORT URL
=========================== */
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    /* 🔴 1. REDIS FIRST */
    const cachedUrl = await redis.get(code);
    if (cachedUrl) {
      return res.redirect(cachedUrl);
    }

    /* 🟡 2. DB FALLBACK (local only) */
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

    // Re-cache in Redis
    await redis.set(code, row.original_url);

    res.redirect(row.original_url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
