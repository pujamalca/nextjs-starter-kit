/**
 * Test database connection and check tables
 */

import mysql from "mysql2/promise";

async function testConnection() {
  const connection = await mysql.createConnection({
    uri: "mysql://alca:alca@localhost:3306/nextjs_starterkit",
  });

  try {
    // Test connection
    const [result] = await connection.execute("SELECT 1 as test");
    console.log("✅ Database connected\n");

    // Check tables
    const [tables]: any = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'nextjs_starterkit'
    `);
    
    console.log("📋 Tables found:");
    tables.forEach((t: any) => console.log(`   - ${t.TABLE_NAME}`));

    // Check users table
    const [users]: any = await connection.execute("SELECT * FROM users LIMIT 5");
    console.log("\n👥 Users in database:", users.length);

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

testConnection();
