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
  },

  // Social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (update session every day)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // Advanced settings
  advanced: {
    generateId: false, // Use default ID generation
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "starter_kit",
  },

  // Plugins
  plugins: [
    nextCookies(), // Required for Next.js App Router
  ],

  // Base URL
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Secret key
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-in-production",
});

// Export types
export type Auth = typeof auth;
