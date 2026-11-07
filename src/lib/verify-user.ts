import User, { Role } from "@/models/user.model";
import { connectToDatabase } from "./db";
import bcrypt from "bcryptjs";

export async function verifyUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{
  name: string;
  email: string;
  sub: unknown;
  provider: string;
  role: Role;
} | null> {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user || !user.password) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;
    return {
      name: user.name,
      email: user.email,
      sub: user._id,
      provider: user.provider,
      role: user.role,
    };
  } catch (error) {
    console.log("Error verifying user:", error);
    return null;
  }
}
