/**
 * Assign roles to users after they've been created via sign-up API
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

async function assignRoles() {
  console.log("🔐 Assigning roles to users...\n");

  const users = await db.select().from(schema.users);

  // Get or create roles
  let [adminRole, moderatorRole, userRole] = await db.select().from(schema.roles);

  if (!adminRole) {
    const { insertId } = await db.insert(schema.roles).values({
      id: Math.random().toString(36).substring(7),
      name: "admin",
      description: "Full system access",
    });
    adminRole = (await db.select().from(schema.roles).where(eq(schema.roles.name, "admin")))[0];
  }
  if (!moderatorRole) {
    await db.insert(schema.roles).values({
      id: Math.random().toString(36).substring(7),
      name: "moderator",
      description: "Content moderation access",
    });
    moderatorRole = (await db.select().from(schema.roles).where(eq(schema.roles.name, "moderator")))[0];
  }
  if (!userRole) {
    await db.insert(schema.roles).values({
      id: Math.random().toString(36).substring(7),
      name: "user",
      description: "Standard user access",
    });
    userRole = (await db.select().from(schema.roles).where(eq(schema.roles.name, "user")))[0];
  }

  // Assign roles based on email
  for (const user of users) {
    let roleId = userRole.id;

    if (user.email.includes("admin")) {
      roleId = adminRole.id;
    } else if (user.email.includes("moderator")) {
      roleId = moderatorRole.id;
    }

    await db.insert(schema.userRoles)
      .values({
        userId: user.id,
        roleId: roleId,
        assignedAt: new Date(),
      })
      .onDuplicateKeyUpdate({ set: { roleId } });

    console.log(`  ✓ ${user.email} -> ${roleId === adminRole.id ? "admin" : roleId === moderatorRole.id ? "moderator" : "user"}`);
  }

  console.log("\n✅ Roles assigned!");
  process.exit(0);
}

assignRoles().catch(console.error);
