import { createClient } from "redis";

// export const redis = createClient({
//   username: "default",
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//     // host: "redis-10397.crce179.ap-south-1-1.ec2.cloud.redislabs.com",
//     // port: 10397,
//     host: "127.0.0.1",
//     port: 6379,

//     connectTimeout: 5000,

//     reconnectStrategy: (retries) => {
//       if(retries > 2){
//         return false;
//       }

//       return Math.min(retries * 200, 1000)
//     }
//   },

//   disableOfflineQueue: true,
//   commandOptions: {
//     timeout: 5000
//   }
// });
export const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.on("error", (err) => console.log("Redis Client Error", err));

let connection: Promise<boolean> | undefined;

// Connect on demand so importing a route during `next build` doesn't contact Redis.
export function connectRedis(): Promise<boolean> {
  if (redis.isReady) return Promise.resolve(true);
  if (!connection) {
    connection = redis
      .connect()
      .then(() => true)
      .catch((error: unknown) => {
        console.error("Redis connection failed:", error);
        connection = undefined;
        return false;
      });
  }
  return connection;
}
