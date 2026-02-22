-- Run this SQL in your MySQL/MariaDB database
-- Database: nextjs_starterkit

-- Drop existing tables if needed
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `files`;
DROP TABLE IF EXISTS `verifications`;
DROP TABLE IF EXISTS `accounts`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;

-- Create users table
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `emailVerified` boolean NOT NULL DEFAULT false,
  `image` varchar(255),
  `password` varchar(255),
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create sessions table
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `ipAddress` varchar(45),
  `userAgent` text,
  `userId` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `session_user_idx` (`userId`),
  CONSTRAINT `sessions_user_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create accounts table
CREATE TABLE `accounts` (
  `id` varchar(255) NOT NULL,
  `accountId` varchar(255) NOT NULL,
  `providerId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `accessToken` text,
  `refreshToken` text,
  `idToken` text,
  `accessTokenExpiresAt` datetime,
  `refreshTokenExpiresAt` datetime,
  `scope` text,
  `password` varchar(255),
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `account_provider_idx` (`providerId`, `userId`),
  CONSTRAINT `accounts_user_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create verifications table
CREATE TABLE `verifications` (
  `id` varchar(255) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `verification_identifier_idx` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create roles table
CREATE TABLE `roles` (
  `id` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name_idx` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create permissions table
CREATE TABLE `permissions` (
  `id` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `resource` varchar(100) NOT NULL,
  `action` enum('create', 'read', 'update', 'delete', 'manage') NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permission_name_idx` (`name`),
  KEY `permission_resource_idx` (`resource`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create role_permissions table
CREATE TABLE `role_permissions` (
  `roleId` varchar(255) NOT NULL,
  `permissionId` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `role_permission_pk` (`roleId`, `permissionId`),
  CONSTRAINT `role_permissions_role_fk` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_permission_fk` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create user_roles table
CREATE TABLE `user_roles` (
  `userId` varchar(255) NOT NULL,
  `roleId` varchar(255) NOT NULL,
  `assignedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `assignedBy` varchar(255),
  KEY `user_role_pk` (`userId`, `roleId`),
  CONSTRAINT `user_roles_user_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_role_fk` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_assigner_fk` FOREIGN KEY (`assignedBy`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create audit_logs table
CREATE TABLE `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `userId` varchar(255),
  `action` varchar(100) NOT NULL,
  `resource` varchar(100) NOT NULL,
  `resourceId` varchar(255),
  `ipAddress` varchar(45),
  `userAgent` text,
  `details` text,
  `status` enum('success', 'failure') NOT NULL DEFAULT 'success',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `audit_user_idx` (`userId`),
  KEY `audit_action_idx` (`action`),
  KEY `audit_resource_idx` (`resource`, `resourceId`),
  KEY `audit_created_idx` (`createdAt`),
  CONSTRAINT `audit_logs_user_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create files table
CREATE TABLE `files` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `originalName` varchar(255) NOT NULL,
  `mimeType` varchar(100) NOT NULL,
  `size` bigint unsigned NOT NULL,
  `path` varchar(500) NOT NULL,
  `uploadedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `file_uploader_idx` (`uploadedBy`),
  KEY `file_created_idx` (`createdAt`),
  CONSTRAINT `files_user_fk` FOREIGN KEY (`uploadedBy`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
