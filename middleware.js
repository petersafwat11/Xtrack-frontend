import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/_next/", "/static/", "/api/", "/svg/"];
const IFRAME_ONLY_PAGES = ["/ocean-af", "/iframe-only-page"]; // Add more pages as needed

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
  const referer = request.headers.get("referer") || "";
  const isIframe = referer.length > 0 && !referer.includes(request.nextUrl.host);

  // ✅ Bypass middleware for public assets
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // ✅ Allow iframe-only pages inside an iframe (but not directly)
  if (IFRAME_ONLY_PAGES.includes(pathname)) {
    if (isIframe) {
      return NextResponse.next(); // Allow iframe access
    } else {
      return NextResponse.redirect(new URL("/login", request.url)); // Block direct access
    }
  }

  // ✅ Require authentication for other pages
  if (!authToken && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Ensure non-admin users can't access restricted pages
  if ((pathname === "/endpoints" || pathname === "/users") && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next|static|svg).*)",
};
