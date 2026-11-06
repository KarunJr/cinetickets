import User from "@/models/user.model";

export async function seedTestData() {
  await User.deleteMany({});

  await User.create({
    name: "Karun Ghimire",
    email: "ghimirekarun406@gmail.com",
    password: "123456",
  });
  await User.create({
    name: "Karuna Ghimire",
    email: "ghimirekaruna406@gmail.com",
    password: "123456",
  });
}