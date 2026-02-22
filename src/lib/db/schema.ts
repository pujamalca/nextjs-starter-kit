/**
 * Database Schema for Next.js Starter Kit
 * 
 * Tables:
 * - users: User accounts
 * - sessions: User sessions
 * - accounts: OAuth accounts (Google, etc)
 * - verifications: Email verification tokens
 * - roles: User roles (admin, user, etc)
 * - permissions: Granular permissions
 * - role_permissions: Many-to-many role-permission mapping
 * - user_roles: Many-to-many user-role mapping
 * - audit_logs: Activity logging for security
 * - files: Uploaded files metadata
 */

import {
  mysqlTable,
  varchar,
  datetime,
  mysqlEnum,
  bigint,
  boolean,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// ============================================
// USERS TABLE
// ============================================
export const users = mysqlTable(
  "users",
  {
    id: varchar({ length: 255 }).primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    emailVerified: boolean().default(false).notNull(),
    image: varchar({ length: 255 }),
    password: varchar({ length: 255 }), // Hashed password
    createdAt: datetime().defaultNow().notNull(),
    updatedAt: datetime().defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

// ============================================
// SESSIONS TABLE
// ============================================
export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar({ length: 255 }).primaryKey(),
    expiresAt: datetime().notNull(),
    ipAddress: varchar({ length: 45 }),
    userAgent: text(),
    userId: varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: datetime().defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("session_user_idx").on(table.userId),
  })
);

// ============================================
// ACCOUNTS TABLE (OAuth)
// ============================================
export const accounts = mysqlTable(
  "accounts",
  {
    id: varchar({ length: 255 }).primaryKey(),
    accountId: varchar({ length: 255 }).notNull(),
    providerId: varchar({ length: 255 }).notNull(),
    userId: varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: datetime(),
    refreshTokenExpiresAt: datetime(),
    scope: text(),
    password: varchar({ length: 255 }),
    createdAt: datetime().defaultNow().notNull(),
    updatedAt: datetime().defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    providerIdx: index("account_provider_idx").on(table.providerId, table.userId),
  })
);

// ============================================
// VERIFICATIONS TABLE
// ============================================
export const verifications = mysqlTable(
  "verifications",
  {
    id: varchar({ length: 255 }).primaryKey(),
    identifier: varchar({ length: 255 }).notNull(),
    value: varchar({ length: 255 }).notNull(),
    expiresAt: datetime().notNull(),
    createdAt: datetime().defaultNow().notNull(),
  },
  (table) => ({
    identifierIdx: index("verification_identifier_idx").on(table.identifier),
  })
);

// ============================================
// ROLES TABLE
// ============================================
export const roles = mysqlTable(
  "roles",
  {
    id: varchar({ length: 255 }).primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    description: text(),
    createdAt: datetime().defaultNow().notNull(),
    updatedAt: datetime().defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    nameIdx: uniqueIndex("role_name_idx").on(table.name),
  })
);

// ============================================
// PERMISSIONS TABLE
// ============================================
export const permissions = mysqlTable(
  "permissions",
  {
    id: varchar({ length: 255 }).primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    description: text(),
    resource: varchar({ length: 100 }).notNull(),
    action: mysqlEnum(["create", "read", "update", "delete", "manage"]).notNull(),
    createdAt: datetime().defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: uniqueIndex("permission_name_idx").on(table.name),
    resourceIdx: index("permission_resource_idx").on(table.resource),
  })
);

// ============================================
// ROLE_PERMISSIONS TABLE (Many-to-Many)
// ============================================
export const rolePermissions = mysqlTable(
  "role_permissions",
  {
    roleId: varchar({ length: 255 })
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: varchar({ length: 255 })
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    createdAt: datetime().defaultNow().notNull(),
  },
  (table) => ({
    pk: index("role_permission_pk").on(table.roleId, table.permissionId),
  })
);

// ============================================
// USER_ROLES TABLE (Many-to-Many)
// ============================================
export const userRoles = mysqlTable(
  "user_roles",
  {
    userId: varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: varchar({ length: 255 })
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    assignedAt: datetime().defaultNow().notNull(),
    assignedBy: varchar({ length: 255 }).references(() => users.id),
  },
  (table) => ({
    pk: index("user_role_pk").on(table.userId, table.roleId),
  })
);

// ============================================
// AUDIT_LOGS TABLE
// ============================================
export const auditLogs = mysqlTable(
  "audit_logs",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .primaryKey(),
    userId: varchar({ length: 255 }).references(() => users.id),
    action: varchar({ length: 100 }).notNull(),
    resource: varchar({ length: 100 }).notNull(),
    resourceId: varchar({ length: 255 }),
    ipAddress: varchar({ length: 45 }),
    userAgent: text(),
    details: text(), // JSON string for additional data
    status: mysqlEnum(["success", "failure"]).default("success").notNull(),
    createdAt: datetime().defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("audit_user_idx").on(table.userId),
    actionIdx: index("audit_action_idx").on(table.action),
    resourceIdx: index("audit_resource_idx").on(table.resource, table.resourceId),
    createdIdx: index("audit_created_idx").on(table.createdAt),
  })
);

// ============================================
// FILES TABLE
// ============================================
export const files = mysqlTable(
  "files",
  {
    id: varchar({ length: 255 }).primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    originalName: varchar({ length: 255 }).notNull(),
    mimeType: varchar({ length: 100 }).notNull(),
    size: bigint({ mode: "number", unsigned: true }).notNull(),
    path: varchar({ length: 500 }).notNull(),
    uploadedBy: varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: datetime().defaultNow().notNull(),
  },
  (table) => ({
    uploadedByIdx: index("file_uploader_idx").on(table.uploadedBy),
    createdIdx: index("file_created_idx").on(table.createdAt),
  })
);

// ============================================
// RELATIONS
// ============================================
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  roles: many(userRoles),
  files: many(files),
  auditLogs: many(auditLogs),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  permissions: many(rolePermissions),
  users: many(userRoles),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  })
);

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
  assigner: one(users, {
    fields: [userRoles.assignedBy],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const filesRelations = relations(files, ({ one }) => ({
  uploader: one(users, {
    fields: [files.uploadedBy],
    references: [users.id],
  }),
}));

// ============================================
// TYPE EXPORTS
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Role = typeof roles.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type File = typeof files.$inferSelect;
