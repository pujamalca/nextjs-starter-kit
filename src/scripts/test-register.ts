/**
 * Direct test Better Auth register
 */

import { auth } from "../lib/auth";

async function test() {
  try {
    console.log("Testing Better Auth register...\n");

    const result = await auth.api.signUpEmail({
      body: {
        email: "demo@demo.com",
        password: "Demo1234",
        name: "Demo User",
      },
    });

    console.log("✅ Register result:", JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("Details:", JSON.stringify(error, null, 2));
  }

  process.exit(0);
}

test();
