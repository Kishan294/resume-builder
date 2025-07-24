import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/editor"];

  // Define auth routes that should redirect if user is already logged in
  const authRoutes = ["/auth/login", "/auth/register"];

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Skip middleware for non-auth related routes
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  try {
    // Get session from the request
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // If user is not authenticated and trying to access protected route
    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // If user is authenticated and trying to access auth routes
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
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
