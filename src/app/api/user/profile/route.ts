/**
 * API: Update Profile
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { logger, auditLog } from "@/lib/utils/logger";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  image: z.string().url().optional().or(z.literal("")),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updates = validation.data;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    // Update user
    await db.update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    auditLog("PROFILE_UPDATE", "user", {
      userId: session.user.id,
      status: "success",
      details: updates,
    });

    logger.info("Profile updated", { userId: session.user.id, updates });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Update profile error", error as Error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
