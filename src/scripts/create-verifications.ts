import mysql from "mysql2/promise";

async function createVerificationsTable() {
  const connection = await mysql.createConnection({
    uri: "mysql://alca:alca@localhost:3306/nextjs_starterkit",
  });

  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS verifications (
        id VARCHAR(255) NOT NULL PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL,
        value VARCHAR(255) NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX verification_identifier_idx (identifier)
      )
    `);
    console.log("✅ Verifications table created");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createVerificationsTable();
