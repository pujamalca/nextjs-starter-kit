/**
 * Next.js Middleware
 * Handles authentication, rate limiting, and security headers
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PUBLIC_ROUTES, AUTH_ROUTES, RATE_LIMITS } from "./lib/utils/constants";
import { checkRateLimit } from "./lib/utils/rate-limit";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings", "/api"];

// Routes that should redirect to dashboard if already authenticated
const GUEST_ONLY_ROUTES = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ============================================
  // SECURITY HEADERS
  // ============================================
  
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  
  // Content Security Policy (adjust based on your needs)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https:",
        "frame-ancestors 'none'",
      ].join("; ")
    );
  }

  // ============================================
  // RATE LIMITING FOR API ROUTES
  // ============================================
  
  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";
    
    // Stricter rate limit for auth routes
    const rateConfig = pathname.startsWith("/api/auth") 
      ? RATE_LIMITS.AUTH 
      : RATE_LIMITS.API;
    
    const rateResult = checkRateLimit(`api:${ip}`, rateConfig);
    
    response.headers.set("X-RateLimit-Limit", rateResult.limit.toString());
    response.headers.set("X-RateLimit-Remaining", rateResult.remaining.toString());
    response.headers.set("X-RateLimit-Reset", rateResult.reset.toString());
    
    if (!rateResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((rateResult.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  }

  // ============================================
  // PUBLIC ROUTES - Skip auth check
  // ============================================
  
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route)
  );
  
  if (isPublicRoute) {
    return response;
  }

  // ============================================
  // SESSION CHECK
  // ============================================
  
  const sessionToken = request.cookies.get("starter_kit.session_token")?.value;
  const isAuthenticated = !!sessionToken;

  // ============================================
  // GUEST ONLY ROUTES - Redirect if authenticated
  // ============================================
  
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  if (isGuestOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.DASHBOARD, request.url));
  }

  // ============================================
  // PROTECTED ROUTES - Redirect if not authenticated
  // ============================================
  
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !isAuthenticated) {
    // For API routes, return 401
    if (pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized", message: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // For pages, redirect to login
    const loginUrl = new URL(AUTH_ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
