import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginSchema } from "./schema";
import { connectToDatabase } from "./lib/db";
import User from "./models/user.model";
import bcrypt from "bcryptjs";

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET_ID,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
    }),

    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          await connectToDatabase();
          const user = await User.findOne({ email });

          if (!user || !user.password) return null;
          
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return {
            name: user.name,
            email: user.email,
            sub: user._id,
            provider: user.provider,
            role: user.role
          };
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
