/**
 * Test Better Auth login
 */

import { auth } from "../lib/auth";
import "dotenv/config";

async function test() {
  try {
    console.log("Testing Better Auth login...\n");

    // Demo user password: Demo1234
    const result = await auth.api.signInEmail({
      body: {
        email: "demo@demo.com",
        password: "Demo1234",
      },
    });

    console.log("✅ Login result:", JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.error("Details:", JSON.stringify(error, null, 2));
  }

  process.exit(0);
}

test();
