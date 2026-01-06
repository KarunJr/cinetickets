import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongoClient";
import { connectToDatabase } from "./lib/db";
import User, { Role } from "./models/user.model";
import { ObjectId } from "mongoose";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schema";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  providers: [
    ...authConfig.providers,
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

  events: {
    async createUser({ user }) {
      console.log("First logged in:", user);
      await connectToDatabase();

      await User.findByIdAndUpdate(user.id, {
        role: Role.User,
      });
    },
  },

  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as string;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email!;
      }
      return session;
    },

    async jwt({ token, account, user }) {
      if (!token.sub) return token;
      await connectToDatabase();

      const existingUser = await User.findOne({ email: token.email });

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      if (user && account?.provider === "credentials") {
        token.sub = (existingUser._id as ObjectId).toString();
      }
      return token;
    },
  },
  adapter: MongoDBAdapter(client),
  session: { strategy: "jwt" },
  // ...authConfig,
});
