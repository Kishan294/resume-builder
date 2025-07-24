import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Route configuration
const ROUTE_CONFIG = {
  protected: ["/dashboard", "/editor"],
  auth: ["/login", "/register"],
  public: ["/", "/resume"],
} as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check route types
  const isProtectedRoute = ROUTE_CONFIG.protected.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = ROUTE_CONFIG.auth.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = ROUTE_CONFIG.public.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // Skip middleware for public routes that don't need auth checks
  if (isPublicRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Skip middleware for non-auth related routes
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  try {
    // Get session from the request
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Handle protected routes
    if (isProtectedRoute && !session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Handle auth routes when user is already logged in
    if (isAuthRoute && session) {
      const redirectUrl =
        request.nextUrl.searchParams.get("redirect") || "/dashboard";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  } catch (error) {
    console.error("Middleware auth error:", error);
    // If there's an error checking auth, allow the request to continue
    // The client-side AuthGuard will handle the protection
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
