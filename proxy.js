import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_ROUTES = ["/login", "/usercreation"];

export default function proxy(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  let isAuthenticated = false;

  if (token) {
    const jwtSecret = process.env.JWT_SECRET;

    if (jwtSecret) {
      try {
        jwt.verify(token, jwtSecret);
        isAuthenticated = true;
      } catch (error) {
        console.error("Proxy JWT verification failed:", error.message);

        isAuthenticated = false;
      }
    } else {
      console.error("JWT_SECRET is missing in proxy.");
    }
  }

  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)",
  ],
};
