import { verifyUser } from "@/lib/verify-user";
import { expect, vi, test } from "vitest";

vi.mock("@/lib/db.ts", () => ({
  connectToDatabase: vi
    .fn()
    .mockRejectedValue(new Error("Database connection failed")),
}));

test("Login should return null when database connection fails", async () => {
  const result = await verifyUser({
    email: "ghimirekarun406@gmail.com",
    password: "123456",
  });

  expect(result).toBeNull();
});
