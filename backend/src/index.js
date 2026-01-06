const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

require("./db/database");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

/* ---------- HEALTH ---------- */
app.get("/", (req, res) => {
  res.send("URL Shortener Backend Running");
});

/* ---------- ROUTES ---------- */
const urlRoutes = require("./routes/urlRoutes");

/* API route */
app.use("/api", urlRoutes);

/* REDIRECT MUST BE ROOT */
app.use("/", urlRoutes);

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log("✅ Backend running on port", PORT);
});
