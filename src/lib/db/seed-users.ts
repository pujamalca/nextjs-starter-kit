/**
 * Database Seed Script - Create Users via Better Auth API
 * This ensures password hashes are compatible
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { randomBytes } from "crypto";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

// Create fresh connection for seed
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = drizzle(pool, { schema, mode: "default" });

// Generate unique ID
function generateId(): string {
  return randomBytes(16).toString("hex");
}

async function seed() {
  console.log("🌱 Starting database seed (users via API)...\n");

  try {
    // ============================================
    // 0. CLEAN EXISTING SEED DATA
    // ============================================
    console.log("🧹 Cleaning existing seed data...");

    const testEmails = [
      "admin@example.com",
      "moderator@example.com",
      "user@example.com",
      "test@example.com"
    ];

    for (const email of testEmails) {
      const users = await db.select()
        .from(schema.users)
        .where(eq(schema.users.email, email));

      for (const user of users) {
        await db.delete(schema.userRoles).where(eq(schema.userRoles.userId, user.id));
        await db.delete(schema.auditLogs).where(eq(schema.auditLogs.userId, user.id));
        await db.delete(schema.sessions).where(eq(schema.sessions.userId, user.id));
        await db.delete(schema.accounts).where(eq(schema.accounts.userId, user.id));
        await db.delete(schema.files).where(eq(schema.files.uploadedBy, user.id));
      }
    }

    for (const email of testEmails) {
      await db.delete(schema.users).where(eq(schema.users.email, email));
    }

    await db.delete(schema.rolePermissions);
    await db.delete(schema.userRoles);
    await db.delete(schema.permissions);
    await db.delete(schema.roles);

    console.log("  ✓ Cleaned existing data\n");

    // ============================================
    // 1. CREATE ROLES
    // ============================================
    console.log("📋 Creating roles...");

    const roles = [
      { id: generateId(), name: "admin", description: "Full system access" },
      { id: generateId(), name: "moderator", description: "Content moderation access" },
      { id: generateId(), name: "user", description: "Standard user access" },
    ];

    for (const role of roles) {
      await db.insert(schema.roles).values(role);
      console.log(`  ✓ Role: ${role.name}`);
    }

    const adminRole = roles.find((r) => r.name === "admin")!;
    const moderatorRole = roles.find((r) => r.name === "moderator")!;
    const userRole = roles.find((r) => r.name === "user")!;

    // ============================================
    // 2. CREATE PERMISSIONS
    // ============================================
    console.log("\n🔐 Creating permissions...");

    const permissions = [
      { id: generateId(), name: "users.create", resource: "users", action: "create" as const, description: "Create new users" },
      { id: generateId(), name: "users.read", resource: "users", action: "read" as const, description: "View users" },
      { id: generateId(), name: "users.update", resource: "users", action: "update" as const, description: "Update users" },
      { id: generateId(), name: "users.delete", resource: "users", action: "delete" as const, description: "Delete users" },
      { id: generateId(), name: "users.manage", resource: "users", action: "manage" as const, description: "Full user management" },
      { id: generateId(), name: "content.create", resource: "content", action: "create" as const, description: "Create content" },
      { id: generateId(), name: "content.read", resource: "content", action: "read" as const, description: "View content" },
      { id: generateId(), name: "content.update", resource: "content", action: "update" as const, description: "Update content" },
      { id: generateId(), name: "content.delete", resource: "content", action: "delete" as const, description: "Delete content" },
      { id: generateId(), name: "content.moderate", resource: "content", action: "manage" as const, description: "Moderate content" },
      { id: generateId(), name: "settings.read", resource: "settings", action: "read" as const, description: "View settings" },
      { id: generateId(), name: "settings.update", resource: "settings", action: "update" as const, description: "Update settings" },
      { id: generateId(), name: "files.upload", resource: "files", action: "create" as const, description: "Upload files" },
      { id: generateId(), name: "files.delete", resource: "files", action: "delete" as const, description: "Delete files" },
      { id: generateId(), name: "audit.read", resource: "audit", action: "read" as const, description: "View audit logs" },
    ];

    for (const permission of permissions) {
      await db.insert(schema.permissions).values(permission);
    }
    console.log(`  ✓ Created ${permissions.length} permissions`);

    // ============================================
    // 3. ASSIGN PERMISSIONS TO ROLES
    // ============================================
    console.log("\n🔗 Assigning permissions to roles...");

    for (const permission of permissions) {
      await db.insert(schema.rolePermissions)
        .values({ roleId: adminRole.id, permissionId: permission.id, createdAt: new Date() });
    }
    console.log(`  ✓ Admin role: All permissions (${permissions.length})`);

    const moderatorPerms = permissions.filter(
      (p) => p.name.includes("content") || p.name.includes("users.read") || p.name.includes("audit.read")
    );
    for (const permission of moderatorPerms) {
      await db.insert(schema.rolePermissions)
        .values({ roleId: moderatorRole.id, permissionId: permission.id, createdAt: new Date() });
    }
    console.log(`  ✓ Moderator role: ${moderatorPerms.length} permissions`);

    const userPerms = permissions.filter(
      (p) => p.name === "content.read" || p.name === "files.upload"
    );
    for (const permission of userPerms) {
      await db.insert(schema.rolePermissions)
        .values({ roleId: userRole.id, permissionId: permission.id, createdAt: new Date() });
    }
    console.log(`  ✓ User role: ${userPerms.length} permissions`);

    // ============================================
    // 4. CREATE USERS VIA API
    // ============================================
    console.log("\n👤 Creating users via sign-up API...");
    console.log("  ⚠️  Please manually register these users or use the script below:");
    console.log("\n# Run these curl commands to create users:");
    console.log(`curl -X POST http://localhost:3000/api/auth/sign-up/email -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"Admin123!","name":"Super Admin"}'`);
    console.log(`curl -X POST http://localhost:3000/api/auth/sign-up/email -H "Content-Type: application/json" -d '{"email":"moderator@example.com","password":"Moderator123!","name":"John Moderator"}'`);
    console.log(`curl -X POST http://localhost:3000/api/auth/sign-up/email -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"User123!","name":"Jane User"}'`);
    console.log(`curl -X POST http://localhost:3000/api/auth/sign-up/email -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'`);

    console.log("\n✅ Seed completed!");
    console.log("\nAfter registering users via API, run the assign-roles script.");

  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed().catch(console.error);
