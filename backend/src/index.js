const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

require("./db/database");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

/* ---------- HEALTH CHECK (IMPORTANT) ---------- */
app.get("/", (req, res) => {
  res.send("URL Shortener Backend Running");
});

/* ---------- ROUTES ---------- */
app.use("/api", require("./routes/urlRoutes"));

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log("✅ Backend running on port", PORT);
});
