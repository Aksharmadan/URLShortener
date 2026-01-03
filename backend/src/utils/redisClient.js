const { createClient } = require("redis");

let redisClient = null;

if (process.env.REDIS_ENABLED === "true") {
  redisClient = createClient();

  redisClient.connect().catch((err) => {
    console.log("Redis connection failed, continuing without Redis");
    redisClient = null;
  });

  redisClient.on("error", (err) => {
    console.log("Redis error:", err.message);
  });
}

module.exports = redisClient;
