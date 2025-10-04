// Path: nextjs-frontend/src/app/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = ["/profile",   "/change-password"];
const publicRoutes = ["/signin", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
    console.log("Path in middleware:", path);
  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  // console.log("Cookie in middleware:", cookie);
  const session = await decrypt(cookie);
    // console.log("Session in middleware:", session);
  // 4. Redirect to /signin if the user is not authenticated
  if (isProtectedRoute && !session?.jwt) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  // 5. Redirect to /profile if the user is authenticated
  if (
    isPublicRoute &&
    session?.jwt &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};