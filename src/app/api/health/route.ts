/**
 * Health Check API
 * Used for monitoring and deployment health checks
 */

import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/db";

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check database connection
    const dbHealthy = await checkDatabaseConnection();
    
    const response = {
      status: dbHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV,
      checks: {
        database: dbHealthy ? "ok" : "error",
      },
      responseTime: `${Date.now() - startTime}ms`,
    };

    return NextResponse.json(response, {
      status: dbHealthy ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
        responseTime: `${Date.now() - startTime}ms`,
      },
      { status: 503 }
    );
  }
}
