/**
 * API: Create Test User (Better Auth compatible)
 * Run once: POST to /api/create-test-user
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Use Better Auth's signUp
    const result = await auth.api.signUpEmail({
      body: {
        email: email || "test@test.com",
        password: password || "password123",
        name: name || "Test User",
      },
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test user created",
      credentials: {
        email: email || "test@test.com",
        password: password || "password123",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
