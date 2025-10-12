// Path: nextjs-frontend/src/app/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/server/session";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard", "/change-password"];
const publicRoutes = ["/signin", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.jwt)
    return NextResponse.redirect(new URL("/signin", req.url));

  if (isPublicRoute && session?.jwt)
    return NextResponse.redirect(new URL("/dashboard", req.url));

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};