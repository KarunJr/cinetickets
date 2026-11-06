import mongoose from "mongoose";
import { expect, test, it, describe, beforeAll, afterAll } from "vitest";
import { verifyUser } from "@/lib/verify-user";
import { seedTestData } from "../setup/seed";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  await seedTestData();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Authentication", () => {
  describe("Login", () => {
    it("should login with valid credentials", async () => {
      const result = await verifyUser({
        email: "ghimirekarun406@gmail.com",
        password: "123456",
      });
      expect(result).toEqual(
        expect.objectContaining({
          email: "ghimirekarun406@gmail.com",
          name: "Karun Ghimire",
          provider: expect.any(String),
          role: expect.any(String),
        }),
      );
      expect(result?.sub).toBeDefined();
    });

    it("should reject invalid passwords", async () => {
      const result = await verifyUser({
        email: "ghimirekarun406@gmail.com",
        password: "12345678",
      });
      expect(result).toBeNull();
    });

    it("should return null when non exist email is provided", async () => {
      const result = await verifyUser({
        email: "ghimirekamala406@gmail.com",
        password: "12345678",
      });
      expect(result).toBeNull();
    });
    test("should return null when empty password is provided", async () => {
      const result = await verifyUser({
        email: "ghimirekarun406@gmail.com",
        password: "",
      });
      expect(result).toBeNull();
    });
  });
});
