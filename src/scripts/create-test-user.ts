/**
 * Create test user directly with MySQL
 */

import mysql from "mysql2/promise";
import { hash } from "bcryptjs";
import { randomUUID } from "crypto";

async function createTestUser() {
  const connection = await mysql.createConnection({
    uri: "mysql://alca:alca@localhost:3306/nextjs_starterkit",
  });

  try {
    const id = randomUUID();
    const hashedPassword = await hash("password123", 10);

    await connection.execute(
      `INSERT INTO users (id, name, email, emailVerified, password, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [id, "Test User", "test@test.com", true, hashedPassword]
    );

    console.log("✅ Test user created:");
    console.log("   Email: test@test.com");
    console.log("   Password: password123");
    console.log("   ID:", id);

    process.exit(0);
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      console.log("ℹ️  User test@test.com already exists");
    } else {
      console.error("❌ Error:", error.message);
      console.error(error);
    }
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createTestUser();
