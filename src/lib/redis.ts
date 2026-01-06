import { createClient } from "redis";

export const redis = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-10397.crce179.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 10397,
  },
});

redis.on("error", (err) => console.log("Redis Client Error", err));

await redis.connect();
