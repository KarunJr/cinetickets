"use server";

import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import { SignupSchema } from "@/schema";
import * as z from "zod";

export const register = async (values: z.infer<typeof SignupSchema>) => {
  try {
    const validatedFields = SignupSchema.safeParse(values);

    if (!validatedFields.success) return { error: "Invalid fields!" };

    const { name, email, password } = validatedFields.data;

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) return { error: "Email already taken!" };

    await User.create({
      email,
      password,
      name,
    });
    return { success: "Account created!" };
  } catch (error) {
    console.error("Register Action error: ", error);
    return { error: "Something wnet wrong!" };
  }
};
