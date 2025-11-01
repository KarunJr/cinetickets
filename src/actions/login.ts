"use server";

import User from "@/models/user.model";
import { LoginSchema } from "@/schema";
import { connectToDatabase } from "@/lib/db";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email } = validatedFields.data;

  await connectToDatabase();
  const existingUser = await User.findOne({ email });

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email doesn't exist!" };
  }

  return { success: "User Verified" };
};
