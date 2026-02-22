import mysql from "mysql2/promise";

async function fixSessionsTable() {
  const c = await mysql.createConnection({
    uri: "mysql://alca:alca@localhost:3306/nextjs_starterkit",
  });

  try {
    // Add updatedAt column
    await c.execute(`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    
    console.log("✅ Sessions table updated");
    
    // Show columns
    const [cols]: any = await c.execute(`DESCRIBE sessions`);
    console.log("\n📋 Sessions columns:", cols.map((c: any) => c.Field).join(", "));

    await c.end();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    await c.end();
    process.exit(1);
  }
}

fixSessionsTable();
