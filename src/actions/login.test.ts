import { expect, test } from "vitest";
import { verifyUser } from "@/lib/verify-user";

test("Login should return a user when valid credentials are provided", async () => {
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

test("Login should return null when invalid credentials are provided", async () => {
  const result = await verifyUser({
    email: "ghimirekarun406@gmail.com",
    password: "12345678",
  });
  expect(result).toBeNull();
});

test("Login should return null when non exist email is provided", async () => {
  const result = await verifyUser({
    email: "ghimirekamala406@gmail.com",
    password: "12345678",
  });
  expect(result).toBeNull();
});

test("Login should return null when empty password is provided", async () => {
  const result = await verifyUser({
    email: "ghimirekarun406@gmail.com",
    password: "",
  });
  expect(result).toBeNull();
});
