const express = require("express");
const { nanoid } = require("nanoid");
const db = require("../db/database");
const redis = require("../utils/redisClient");

const BASE_URL = "http://localhost:5050";

const router = express.Router();

/* SIMPLE URL VALIDATION */
function isValidUrl(url) {
  return /^https?:\/\//i.test(url);
}

/* CREATE SHORT URL */
router.post("/shorten", (req, res) => {
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
  let expiresAt = null;

  if (expiresIn) {
    expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
  }

  db.get(
    "SELECT * FROM urls WHERE short_code = ?",
    [shortCode],
    (err, row) => {
      if (row) {
        return res.status(409).json({
          error: "Short code already exists",
        });
      }

      db.run(
        "INSERT INTO urls (short_code, original_url, expires_at) VALUES (?, ?, ?)",
        [shortCode, originalUrl, expiresAt],
        () => {
          res.json({
            shortUrl: `${BASE_URL}/${shortCode}`,
          });
        }
      );
    }
  );
});

/* REDIRECT */
router.get("/:code", async (req, res) => {
  const code = req.params.code;

  const cached = await redis.get(code);
  if (cached) return res.redirect(cached);

  db.get(
    "SELECT original_url, expires_at FROM urls WHERE short_code = ?",
    [code],
    async (err, row) => {
      if (!row) return res.status(404).send("URL not found");

      if (row.expires_at && new Date(row.expires_at) < new Date()) {
        return res.status(410).send("This link has expired");
      }

      await redis.set(code, row.original_url);

      db.run(
        "INSERT INTO clicks (short_code, user_agent, ip) VALUES (?, ?, ?)",
        [code, req.headers["user-agent"], req.ip]
      );

      res.redirect(row.original_url);
    }
  );
});

module.exports = router;
