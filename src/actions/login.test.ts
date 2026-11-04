import { expect, test } from "vitest";
import { login } from "./login";

test("Login function when enter valid input user must be login", async () => {
  const result = await login({
    email: "ghimirekarun406@gmail.com",
    password: "12345678",
  });
  expect(result.success).toBe("User Verified");
});
