import { NextResponse } from "next/server";

// Add images to public paths
const PUBLIC_PATHS = ["/_next/", "/static/", "/api/", "/svg/"];

export function middleware(request) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Bypass middleware for public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token");
  const userCookie = request.cookies.get("user");

  // Allow access to login page without authentication
  if (pathname === "/login") {
    if (token && userCookie) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Require authentication for all other pages
  if (!token || !userCookie) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /images/ (static files)
     * 4. /favicon.ico, /site.webmanifest (static files)
     */
    "/((?!api|_next|images|favicon.ico|site.webmanifest).*)",
  ],
};
