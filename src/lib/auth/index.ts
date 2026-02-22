/**
 * Better Auth Configuration
 * Supports: Email/Password, Google OAuth
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
  // Database adapter
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  // Email/Password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  // Trusted origins (important for cookies)
  trustedOrigins: [
    "http://localhost:3000",
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // Advanced settings
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "starter_kit",
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  // Plugins
  plugins: [
    nextCookies(),
  ],

  // Base URL
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Secret key
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-in-production",
});

// Export types
export type Auth = typeof auth;
