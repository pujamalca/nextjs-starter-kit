/**
 * Application Constants
 */

// ============================================
// APP INFO
// ============================================

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Next.js Starter Kit";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const APP_VERSION = "1.0.0";

// ============================================
// AUTH CONSTANTS
// ============================================

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  DASHBOARD: "/dashboard",
} as const;

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api/health",
  "/api/auth",
] as const;

// ============================================
// FILE UPLOAD CONSTANTS
// ============================================

export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "5242880"); // 5MB
export const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

export const ALLOWED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ],
  spreadsheet: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
} as const;

// ============================================
// RATE LIMITING
// ============================================

export const RATE_LIMITS = {
  AUTH: { max: 5, window: 60000 }, // 5 requests per minute for auth
  API: { max: 100, window: 60000 }, // 100 requests per minute for API
  UPLOAD: { max: 10, window: 60000 }, // 10 uploads per minute
} as const;

// ============================================
// PAGINATION
// ============================================

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// ============================================
// SESSION
// ============================================

export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds
export const SESSION_UPDATE_AGE = 60 * 60 * 24; // 1 day in seconds

// ============================================
// SEO DEFAULTS
// ============================================

export const SEO_DEFAULTS = {
  titleTemplate: `%s | ${APP_NAME}`,
  defaultTitle: APP_NAME,
  description: "Professional Next.js starter kit with authentication, database, and more.",
  keywords: ["nextjs", "starter kit", "typescript", "react", "tailwindcss"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
  },
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Anda harus login untuk mengakses halaman ini",
  FORBIDDEN: "Anda tidak memiliki akses ke halaman ini",
  NOT_FOUND: "Halaman tidak ditemukan",
  INTERNAL_ERROR: "Terjadi kesalahan internal. Silakan coba lagi",
  RATE_LIMIT: "Terlalu banyak permintaan. Silakan coba lagi nanti",
  INVALID_CSRF: "Token CSRF tidak valid",
  FILE_TOO_LARGE: "File terlalu besar",
  INVALID_FILE_TYPE: "Tipe file tidak diizinkan",
} as const;
