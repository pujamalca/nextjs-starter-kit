/**
 * Global Type Definitions
 */

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// USER TYPES
// ============================================

export interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
  roles: RoleInfo[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleInfo {
  id: string;
  name: string;
  permissions: string[];
}

export interface UserSession {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================
// AUTH TYPES
// ============================================

export interface AuthContextType {
  user: UserWithRoles | null;
  session: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// ============================================
// FILE TYPES
// ============================================

export interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface FileUploadResult {
  success: boolean;
  file?: UploadedFile;
  error?: string;
}

// ============================================
// AUDIT LOG TYPES
// ============================================

export interface AuditLogEntry {
  id: number;
  userId?: string;
  userName?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  status: "success" | "failure";
  details?: Record<string, unknown>;
  createdAt: Date;
}

// ============================================
// NAVIGATION TYPES
// ============================================

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
  permission?: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "textarea" | "select" | "checkbox";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { label: string; value: string }[];
}

// ============================================
// TABLE TYPES
// ============================================

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  loading?: boolean;
  onRowClick?: (row: T) => void;
}

// ============================================
// ERROR TYPES
// ============================================

export class AppError extends Error {
  code: string;
  statusCode: number;
  
  constructor(message: string, code: string, statusCode: number = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: Record<string, string[]>) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, "RATE_LIMIT", 429);
    this.name = "RateLimitError";
  }
}

// ============================================
// ENVIRONMENT TYPE
// ============================================

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      DATABASE_URL: string;
      
      // Auth
      BETTER_AUTH_SECRET: string;
      BETTER_AUTH_URL: string;
      
      // OAuth
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
      
      // App
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_APP_NAME: string;
      NODE_ENV: "development" | "production" | "test";
      
      // Rate Limiting
      RATE_LIMIT_MAX?: string;
      RATE_LIMIT_WINDOW?: string;
      
      // File Upload
      MAX_FILE_SIZE?: string;
      UPLOAD_DIR?: string;
      
      // Logging
      LOG_LEVEL?: "debug" | "info" | "warn" | "error";
    }
  }
}

// Prevent multiple declarations
export {};
