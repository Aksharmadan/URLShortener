const { createClient } = require("redis");

let redisClient;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on("error", (err) =>
    console.error("❌ Redis error:", err)
  );

  redisClient
    .connect()
    .then(() => console.log("✅ Redis connected"))
    .catch((err) =>
      console.error("❌ Redis connection failed:", err)
    );
} else {
  console.warn("⚠️ REDIS_URL not set. Redis disabled.");
}

module.exports = redisClient;
