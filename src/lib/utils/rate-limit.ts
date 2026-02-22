/**
 * Rate Limiter
 * In-memory rate limiting for API routes
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Cleanup expired entries every minute
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   * @default 100
   */
  max?: number;
  
  /**
   * Time window in milliseconds
   * @default 60000 (1 minute)
   */
  window?: number;
  
  /**
   * Key prefix for identification
   * @default "rate_limit"
   */
  prefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): RateLimitResult {
  const {
    max = parseInt(process.env.RATE_LIMIT_MAX || "100"),
    window = parseInt(process.env.RATE_LIMIT_WINDOW || "60000"),
    prefix = "rate_limit",
  } = config;

  const key = `${prefix}:${identifier}`;
  const now = Date.now();
  const resetTime = now + window;

  // Get or create entry
  if (!store[key] || store[key].resetTime < now) {
    store[key] = { count: 0, resetTime };
  }

  // Increment count
  store[key].count++;

  const remaining = Math.max(0, max - store[key].count);
  const success = store[key].count <= max;

  return {
    success,
    limit: max,
    remaining,
    reset: store[key].resetTime,
  };
}

/**
 * Rate limit middleware helper
 * Returns null if allowed, or Response if rate limited
 */
export function rateLimitMiddleware(
  identifier: string,
  config?: RateLimitConfig
): Response | null {
  const result = checkRateLimit(identifier, config);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.reset.toString(),
          "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null;
}

/**
 * Get client IP from headers
 */
export function getClientIP(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const realIP = headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return "unknown";
}
