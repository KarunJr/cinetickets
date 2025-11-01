import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
  apiHandlers,
} from "@/routes";
import { getToken } from "next-auth/jwt";

interface TokenIF {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  sub?: string;
  iat?: number;
  exp?: number;
  jti?: string;
}

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;
  // const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiHandler = nextUrl.pathname.startsWith(apiHandlers);

  // Allow non-admin API routes to proceed normally
  if (isApiHandler && !nextUrl.pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Allow all movies routes
  if (nextUrl.pathname.startsWith("/movies/")) {
    return NextResponse.next();
  }

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Admin Checking From Client Routes:
  const isAdmin = (token: TokenIF | null) => token?.role === "admin";

  if (nextUrl.pathname.startsWith("/admin") && token && !isAdmin(token)) {
    // if (!token || token.role !== "admin") {
    // }
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Admin Checking From API Routes:

  if (isApiHandler && nextUrl.pathname.startsWith("/api/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Admin only!" }, { status: 403 });
    }
  }
  return NextResponse.next();
});

export const config = {
  //This is copied from Clerk for better middleware matcher. https://clerk.com/docs/references/nextjs/clerk-middleware
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
