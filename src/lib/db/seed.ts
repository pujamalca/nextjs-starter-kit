/**
 * Database Seed Script
 * Run with: npm run db:seed
 */

import { db } from "./index";
import { roles, permissions, rolePermissions } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Seed roles
    const rolesData = [
      { id: "role_admin", name: "admin", description: "Administrator with full access" },
      { id: "role_user", name: "user", description: "Standard user" },
    ];

    await db.insert(roles).values(rolesData).onDuplicateKeyUpdate({
      set: { name: rolesData[0].name },
    });
    console.log("✅ Roles seeded");

    // Seed permissions
    const permissionsData = [
      { id: "perm_user_read", name: "user:read", description: "View users", resource: "user", action: "read" },
      { id: "perm_user_create", name: "user:create", description: "Create users", resource: "user", action: "create" },
      { id: "perm_user_update", name: "user:update", description: "Update users", resource: "user", action: "update" },
      { id: "perm_user_delete", name: "user:delete", description: "Delete users", resource: "user", action: "delete" },
      { id: "perm_file_read", name: "file:read", description: "View files", resource: "file", action: "read" },
      { id: "perm_file_create", name: "file:create", description: "Upload files", resource: "file", action: "create" },
      { id: "perm_file_delete", name: "file:delete", description: "Delete files", resource: "file", action: "delete" },
    ];

    await db.insert(permissions).values(permissionsData).onDuplicateKeyUpdate({
      set: { name: permissionsData[0].name },
    });
    console.log("✅ Permissions seeded");

    // Assign all permissions to admin role
    const rolePermsData = permissionsData.map((p) => ({
      roleId: "role_admin",
      permissionId: p.id,
    }));

    await db.insert(rolePermissions).values(rolePermsData).onDuplicateKeyUpdate({
      set: { roleId: rolePermsData[0].roleId },
    });
    console.log("✅ Role permissions seeded");

    console.log("🎉 Seeding completed!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
