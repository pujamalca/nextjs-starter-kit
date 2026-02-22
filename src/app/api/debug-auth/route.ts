/**
 * Debug Auth Endpoint
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    // Test auth config
    const config = {
      emailAndPassword: auth.options.emailAndPassword,
      baseURL: auth.options.baseURL,
      secret: auth.options.secret ? "SET" : "NOT SET",
    };

    return NextResponse.json({
      status: "ok",
      config,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
