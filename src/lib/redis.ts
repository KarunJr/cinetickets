import { createClient } from "redis";

export const redis = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-13340.crce220.us-east-1-4.ec2.redns.redis-cloud.com",
    port: 13340,
  },
});

redis.on("error", (err) => console.log("Redis Client Error", err));

await redis.connect();
