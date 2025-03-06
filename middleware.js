
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/_next/", "/static/", "/api/", "/svg/"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("token")?.value;

  let user = null;
  try {
    user = JSON.parse(request.cookies.get("user")?.value || "{}");
  } catch (error) {
    console.error("Error parsing user cookie:", error);
  }

  const isAdmin = user?.menuPermissions?.showSettingsAPI || false;

  // Bypass middleware for public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Require authentication for other pages
  if (!authToken && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow access to login page without authentication
  if (authToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Ensure non-admin users don't get stuck in a loop when accessing restricted pages
  if ((pathname === "/endpoints" || pathname === "/users") && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next|static|svg).*)",
};

