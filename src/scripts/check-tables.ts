import mysql from "mysql2/promise";

async function checkTables() {
  const c = await mysql.createConnection({
    uri: "mysql://alca:alca@localhost:3306/nextjs_starterkit",
  });

  try {
    // Check sessions table structure
    const [cols]: any = await c.execute(`DESCRIBE sessions`);
    console.log("📋 Sessions table:");
    cols.forEach((col: any) => {
      console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    console.log("\n📋 Accounts table:");
    const [acols]: any = await c.execute(`DESCRIBE accounts`);
    acols.forEach((col: any) => {
      console.log(`   ${col.Field}: ${col.Type}`);
    });

    console.log("\n📋 Users table:");
    const [ucols]: any = await c.execute(`DESCRIBE users`);
    ucols.forEach((col: any) => {
      console.log(`   ${col.Field}: ${col.Type}`);
    });

    await c.end();
  } catch (e: any) {
    console.error(e.message);
    await c.end();
  }
}

checkTables();
