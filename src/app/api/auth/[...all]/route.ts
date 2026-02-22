/**
 * Better Auth API Route
 * Handles all authentication requests
 * Path: /api/auth/[...all]
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
