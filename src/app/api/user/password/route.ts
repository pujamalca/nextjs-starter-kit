/**
 * API: Change Password
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { logger, auditLog } from "@/lib/utils/logger";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8).max(128)
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil")
    .regex(/[0-9]/, "Password harus mengandung angka"),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validation.data;

    // Verify current password using Better Auth
    const signInResult = await auth.api.signInEmail({
      body: {
        email: session.user.email,
        password: currentPassword,
      },
    });

    if (!signInResult) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Update password
    await db.update(users)
      .set({ 
        password: newPassword, // Better Auth will hash this
        updatedAt: new Date() 
      })
      .where(eq(users.id, session.user.id));

    auditLog("PASSWORD_CHANGE", "user", {
      userId: session.user.id,
      status: "success",
    });

    logger.info("Password changed", { userId: session.user.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Change password error", error as Error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
