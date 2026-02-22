/**
 * Database Connection
 * Drizzle ORM with MySQL/MariaDB
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Ensure env is loaded
import "dotenv/config";

// Create connection pool
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create drizzle instance
export const db = drizzle(pool, { schema, mode: "default" });

// Export pool for cleanup
export { pool };

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}
