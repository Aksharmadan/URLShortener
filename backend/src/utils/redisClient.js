const { createClient } = require("redis");

const redisClient = createClient();

(async () => {
  await redisClient.connect();
  console.log("Redis connected");
})();

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redisClient;
