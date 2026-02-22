/**
 * Database Seed Script
 * Creates admin, users, roles, and permissions
 * 
 * Run: npx tsx src/lib/db/seed.ts
 */

import mysql from "mysql2/promise";
import { randomUUID } from "crypto";
import { hash } from "bcryptjs";

const DATABASE_URL = "mysql://alca:alca@localhost:3306/nextjs_starterkit";

async function seed() {
  const connection = await mysql.createConnection({ uri: DATABASE_URL });

  console.log("🌱 Starting database seed...\n");

  try {
    // ============================================
    // 1. CLEAN EXISTING DATA
    // ============================================
    console.log("📦 Cleaning existing data...");
    await connection.execute("DELETE FROM user_roles");
    await connection.execute("DELETE FROM role_permissions");
    await connection.execute("DELETE FROM audit_logs");
    await connection.execute("DELETE FROM files");
    await connection.execute("DELETE FROM accounts");
    await connection.execute("DELETE FROM sessions");
    await connection.execute("DELETE FROM verifications");
    await connection.execute("DELETE FROM users");
    await connection.execute("DELETE FROM role_permissions");
    await connection.execute("DELETE FROM user_roles");
    await connection.execute("DELETE FROM permissions");
    await connection.execute("DELETE FROM roles");
    console.log("✅ Data cleaned\n");

    // ============================================
    // 2. CREATE ROLES
    // ============================================
    console.log("👤 Creating roles...");
    
    const adminRoleId = randomUUID();
    const userRoleId = randomUUID();

    await connection.execute(
      `INSERT INTO roles (id, name, description, createdAt, updatedAt) VALUES 
       (?, 'admin', 'Full system administrator', NOW(), NOW()),
       (?, 'user', 'Regular user with basic access', NOW(), NOW())`,
      [adminRoleId, userRoleId]
    );

    console.log("✅ Roles created: admin, user\n");

    // ============================================
    // 3. CREATE PERMISSIONS
    // ============================================
    console.log("🔐 Creating permissions...");

    const permissions = [
      // User management
      { id: randomUUID(), name: "users.create", resource: "users", action: "create", desc: "Create new users" },
      { id: randomUUID(), name: "users.read", resource: "users", action: "read", desc: "View users" },
      { id: randomUUID(), name: "users.update", resource: "users", action: "update", desc: "Edit users" },
      { id: randomUUID(), name: "users.delete", resource: "users", action: "delete", desc: "Delete users" },
      
      // File management
      { id: randomUUID(), name: "files.create", resource: "files", action: "create", desc: "Upload files" },
      { id: randomUUID(), name: "files.read", resource: "files", action: "read", desc: "View files" },
      { id: randomUUID(), name: "files.delete", resource: "files", action: "delete", desc: "Delete files" },
      
      // Settings
      { id: randomUUID(), name: "settings.read", resource: "settings", action: "read", desc: "View settings" },
      { id: randomUUID(), name: "settings.update", resource: "settings", action: "update", desc: "Edit settings" },
      
      // Dashboard
      { id: randomUUID(), name: "dashboard.read", resource: "dashboard", action: "read", desc: "Access dashboard" },
      
      // Audit logs
      { id: randomUUID(), name: "audit.read", resource: "audit", action: "read", desc: "View audit logs" },
    ];

    for (const perm of permissions) {
      await connection.execute(
        `INSERT INTO permissions (id, name, description, resource, action, createdAt) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [perm.id, perm.name, perm.desc, perm.resource, perm.action]
      );
    }

    console.log(`✅ ${permissions.length} permissions created\n`);

    // ============================================
    // 4. ASSIGN PERMISSIONS TO ROLES
    // ============================================
    console.log("🔗 Assigning permissions to roles...");

    // Admin gets ALL permissions
    for (const perm of permissions) {
      await connection.execute(
        `INSERT INTO role_permissions (roleId, permissionId, createdAt) VALUES (?, ?, NOW())`,
        [adminRoleId, perm.id]
      );
    }

    // User gets basic permissions only
    const userPermissionNames = ["users.read", "files.create", "files.read", "settings.read", "dashboard.read"];
    for (const perm of permissions) {
      if (userPermissionNames.includes(perm.name)) {
        await connection.execute(
          `INSERT INTO role_permissions (roleId, permissionId, createdAt) VALUES (?, ?, NOW())`,
          [userRoleId, perm.id]
        );
      }
    }

    console.log("✅ Permissions assigned\n");

    // ============================================
    // 5. CREATE USERS
    // ============================================
    console.log("👥 Creating users...");

    const users = [
      {
        id: randomUUID(),
        name: "Admin User",
        email: "admin@admin.com",
        password: await hash("Admin123", 10),
        role: adminRoleId,
      },
      {
        id: randomUUID(),
        name: "Demo User",
        email: "demo@demo.com",
        password: await hash("Demo1234", 10),
        role: userRoleId,
      },
      {
        id: randomUUID(),
        name: "Test User",
        email: "test@test.com",
        password: await hash("Test1234", 10),
        role: userRoleId,
      },
    ];

    for (const user of users) {
      await connection.execute(
        `INSERT INTO users (id, name, email, emailVerified, password, createdAt, updatedAt) 
         VALUES (?, ?, ?, true, ?, NOW(), NOW())`,
        [user.id, user.name, user.email, user.password]
      );

      // Assign role
      await connection.execute(
        `INSERT INTO user_roles (userId, roleId, assignedAt) VALUES (?, ?, NOW())`,
        [user.id, user.role]
      );

      // Create account record for Better Auth
      await connection.execute(
        `INSERT INTO accounts (id, accountId, providerId, userId, password, createdAt, updatedAt) 
         VALUES (?, ?, 'credential', ?, ?, NOW(), NOW())`,
        [randomUUID(), user.email, user.id, user.password]
      );
    }

    console.log("✅ Users created\n");

    // ============================================
    // 6. SUMMARY
    // ============================================
    console.log("=" .repeat(50));
    console.log("🌱 SEED COMPLETED!\n");
    
    console.log("👤 USERS:");
    console.log("┌─────────────────────────────────────────────┐");
    console.log("│ Email              │ Password   │ Role      │");
    console.log("├─────────────────────────────────────────────┤");
    console.log("│ admin@admin.com    │ Admin123   │ admin     │");
    console.log("│ demo@demo.com      │ Demo1234   │ user      │");
    console.log("│ test@test.com      │ Test1234   │ user      │");
    console.log("└─────────────────────────────────────────────┘\n");

    console.log("🔐 ROLES: admin, user");
    console.log(`📜 PERMISSIONS: ${permissions.length} total`);
    console.log("   - Admin: ALL permissions");
    console.log("   - User: basic permissions only\n");

    await connection.end();
    process.exit(0);

  } catch (error: any) {
    console.error("❌ Seed error:", error.message);
    console.error(error);
    await connection.end();
    process.exit(1);
  }
}

seed();
