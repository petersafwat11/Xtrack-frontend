import { NextResponse } from "next/server";

// Add images to public paths
const PUBLIC_PATHS = ["/_next/", "/static/", "/api/", "/svg/"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Bypass middleware for public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const authToken = request.cookies.get("token")?.value;
  const user = JSON.parse(request.cookies.get("user")?.value);
  const isAdmin = user.menuPermissions.showSettingsAPI;
  // Protect all other routes
  if (!authToken) {
    // If user is not authenticated, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if( (pathname === "/endpoints"|| pathname === "/users") && !isAdmin){
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // Allow access to login page without authentication
  if (pathname === "/login") {
    if (authToken) {
      // If user is authenticated, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /static/ (static files)
     * 4. /svg/ (svg files)
     */
    "/((?!api|_next|static|svg).*)",
  ],
};
