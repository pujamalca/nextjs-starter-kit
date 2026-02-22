/**
 * File Upload API
 * Handles file uploads with validation
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { rateLimitMiddleware, getClientIP } from "@/lib/utils/rate-limit";
import { logger, auditLog } from "@/lib/utils/logger";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES, UPLOAD_DIR } from "@/lib/utils/constants";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

// Allowed MIME types
const ALL_ALLOWED_TYPES = [
  ...ALLOWED_FILE_TYPES.image,
  ...ALLOWED_FILE_TYPES.document,
  ...ALLOWED_FILE_TYPES.spreadsheet,
];

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request.headers);
    const rateLimitResponse = rateLimitMiddleware(`upload:${ip}`, { max: 10, window: 60000 });
    if (rateLimitResponse) return rateLimitResponse;

    // Authentication check
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse multipart form
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Bad request", message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: "File too large", 
          message: `Maximum file size is ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB` 
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALL_ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          error: "Invalid file type", 
          message: "File type not allowed",
          allowedTypes: ALL_ALLOWED_TYPES
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileId = randomUUID();
    const ext = file.name.split(".").pop() || "bin";
    const fileName = `${fileId}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save to database
    await db.insert(files).values({
      id: fileId,
      name: fileName,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      path: filePath,
      uploadedBy: session.user.id,
    });

    // Audit log
    auditLog("FILE_UPLOAD", "file", {
      userId: session.user.id,
      resourceId: fileId,
      status: "success",
      details: {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      },
    });

    logger.info("File uploaded", { 
      fileId, 
      fileName: file.name, 
      userId: session.user.id 
    });

    return NextResponse.json({
      success: true,
      file: {
        id: fileId,
        name: fileName,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/api/files/${fileId}`,
      },
    });
  } catch (error) {
    logger.error("File upload error", error as Error);
    return NextResponse.json(
      { error: "Internal error", message: "Failed to upload file" },
      { status: 500 }
    );
  }
}
