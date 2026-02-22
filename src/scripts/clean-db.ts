/**
 * Test Better Auth Register & Login
 */

import mysql from "mysql2/promise";

async function test() {
  const connection = await mysql.createConnection({
    uri: "mysql://alca:alca@localhost:3306/nextjs_starterkit",
  });

  try {
    // 1. Delete existing test user
    await connection.execute("DELETE FROM users WHERE email = ?", ["test@test.com"]);
    await connection.execute("DELETE FROM accounts WHERE accountId = ?", ["test@test.com"]);
    console.log("✅ Cleaned old test user\n");

    // 2. Delete verifications table if exists (causes issues with Better Auth)
    try {
      await connection.execute("DROP TABLE IF EXISTS verifications");
      console.log("✅ Dropped verifications table\n");
    } catch (e) {
      // ignore
    }

    // 3. Show remaining tables
    const [tables]: any = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'nextjs_starterkit'
    `);
    console.log("📋 Tables:", tables.map((t: any) => t.TABLE_NAME).join(", "));

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

test();
