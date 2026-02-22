import mysql from "mysql2/promise";

async function check() {
  const c = await mysql.createConnection({
    uri: "mysql://alca:alca@localhost:3306/nextjs_starterkit",
  });

  const [u]: any = await c.execute("SELECT id, email, name FROM users");
  console.log("Users:", u);

  const [a]: any = await c.execute("SELECT id, userId, providerId FROM accounts");
  console.log("Accounts:", a);

  await c.end();
}

check();
