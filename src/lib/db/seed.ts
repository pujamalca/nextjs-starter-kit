/**
 * Database Seed Script
 * Creates initial users, roles, and permissions
 * Using better-auth API for proper password hashing
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { randomBytes, scryptSync } from "crypto";
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

// Password hashing compatible with better-auth (scrypt)
// Format: scrypt:<N>:<r>:<p>:<keylen>:<salt(hex)>:<hash(hex)>
function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const keylen = 64;
  const N = 2048;   // CPU/memory cost parameter (lowered)
  const r = 8;      // Block size parameter (lowered)
  const p = 1;      // Parallelization parameter

  const derivedKey = scryptSync(password, salt, keylen, { N, r, p }) as Buffer;

  return `scrypt:${N}:${r}:${p}:${keylen}:${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

async function seed() {
  console.log("🌱 Starting database seed...\n");

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

    // Get user IDs for test emails
    const existingUsers = await db.select()
      .from(schema.users)
      .where(eq(schema.users.email, testEmails[0]));

    // Delete related data for existing test users
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

    // Delete test users
    for (const email of testEmails) {
      await db.delete(schema.users).where(eq(schema.users.email, email));
    }

    // Delete existing roles and permissions
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
      // User management
      { id: generateId(), name: "users.create", resource: "users", action: "create" as const, description: "Create new users" },
      { id: generateId(), name: "users.read", resource: "users", action: "read" as const, description: "View users" },
      { id: generateId(), name: "users.update", resource: "users", action: "update" as const, description: "Update users" },
      { id: generateId(), name: "users.delete", resource: "users", action: "delete" as const, description: "Delete users" },
      { id: generateId(), name: "users.manage", resource: "users", action: "manage" as const, description: "Full user management" },

      // Content management
      { id: generateId(), name: "content.create", resource: "content", action: "create" as const, description: "Create content" },
      { id: generateId(), name: "content.read", resource: "content", action: "read" as const, description: "View content" },
      { id: generateId(), name: "content.update", resource: "content", action: "update" as const, description: "Update content" },
      { id: generateId(), name: "content.delete", resource: "content", action: "delete" as const, description: "Delete content" },
      { id: generateId(), name: "content.moderate", resource: "content", action: "manage" as const, description: "Moderate content" },

      // Settings management
      { id: generateId(), name: "settings.read", resource: "settings", action: "read" as const, description: "View settings" },
      { id: generateId(), name: "settings.update", resource: "settings", action: "update" as const, description: "Update settings" },

      // File management
      { id: generateId(), name: "files.upload", resource: "files", action: "create" as const, description: "Upload files" },
      { id: generateId(), name: "files.delete", resource: "files", action: "delete" as const, description: "Delete files" },

      // Audit logs
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

    // Admin gets all permissions
    for (const permission of permissions) {
      await db.insert(schema.rolePermissions)
        .values({ roleId: adminRole.id, permissionId: permission.id, createdAt: new Date() });
    }
    console.log(`  ✓ Admin role: All permissions (${permissions.length})`);

    // Moderator permissions
    const moderatorPerms = permissions.filter(
      (p) => p.name.includes("content") || p.name.includes("users.read") || p.name.includes("audit.read")
    );
    for (const permission of moderatorPerms) {
      await db.insert(schema.rolePermissions)
        .values({ roleId: moderatorRole.id, permissionId: permission.id, createdAt: new Date() });
    }
    console.log(`  ✓ Moderator role: ${moderatorPerms.length} permissions`);

    // Standard user permissions
    const userPerms = permissions.filter(
      (p) => p.name === "content.read" || p.name === "files.upload"
    );
    for (const permission of userPerms) {
      await db.insert(schema.rolePermissions)
        .values({ roleId: userRole.id, permissionId: permission.id, createdAt: new Date() });
    }
    console.log(`  ✓ User role: ${userPerms.length} permissions`);

    // ============================================
    // 4. CREATE USERS
    // ============================================
    console.log("\n👤 Creating users...");

    const users = [
      {
        id: generateId(),
        name: "Super Admin",
        email: "admin@example.com",
        password: hashPassword("admin123"),
        emailVerified: true,
        role: adminRole,
      },
      {
        id: generateId(),
        name: "John Moderator",
        email: "moderator@example.com",
        password: hashPassword("moderator123"),
        emailVerified: true,
        role: moderatorRole,
      },
      {
        id: generateId(),
        name: "Jane User",
        email: "user@example.com",
        password: hashPassword("user123"),
        emailVerified: true,
        role: userRole,
      },
      {
        id: generateId(),
        name: "Test User",
        email: "test@example.com",
        password: hashPassword("test123"),
        emailVerified: false,
        role: userRole,
      },
    ];

    for (const user of users) {
      await db.insert(schema.users).values({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        emailVerified: user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Assign role to user
      await db.insert(schema.userRoles)
        .values({
          userId: user.id,
          roleId: user.role.id,
          assignedAt: new Date(),
        });

      console.log(`  ✓ User: ${user.name} (${user.email})`);
    }

    // ============================================
    // 5. CREATE SAMPLE AUDIT LOGS
    // ============================================
    console.log("\n📝 Creating sample audit logs...");

    const admin = users.find((u) => u.email === "admin@example.com")!;
    const testUser = users.find((u) => u.email === "test@example.com")!;

    await db.insert(schema.auditLogs).values([
      {
        userId: admin.id,
        action: "login",
        resource: "auth",
        resourceId: admin.id,
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        status: "success",
        createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
      {
        userId: admin.id,
        action: "create",
        resource: "users",
        resourceId: testUser.id,
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        details: JSON.stringify({ message: "Created new user account" }),
        status: "success",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      },
    ]);

    console.log(`  ✓ Created 2 audit logs`);

    // ============================================
    // DONE
    // ============================================
    console.log("\n✅ Seed completed successfully!\n");
    console.log("┌─────────────────────────────────────────────────────────┐");
    console.log("│  📧 TEST ACCOUNTS                                       │");
    console.log("├─────────────────────────────────────────────────────────┤");
    console.log("│  Admin:        admin@example.com  /  admin123          │");
    console.log("│  Moderator:    moderator@example.com  /  moderator123  │");
    console.log("│  User:         user@example.com  /  user123            │");
    console.log("│  Test:         test@example.com  /  test123            │");
    console.log("└─────────────────────────────────────────────────────────┘\n");

  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run seed
seed().catch(console.error);
