const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
  // username: process.env.REDIS_USER,
  // password: process.env.REDIS_PWD,
});

client.on("connect", () => console.log("redis connected"));

client.on("ready", () => console.log("redis ready to use"));

client.on("error", (err) => console.log(err.message));

client.connect().then();

module.exports = client;
