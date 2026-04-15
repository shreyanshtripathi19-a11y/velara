import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

// Replace a static image file on disk
export async function POST(req: NextRequest) {
  try {
    verifyAdmin(req);
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetPath = formData.get("targetPath") as string;

    if (!file || !targetPath) {
      return NextResponse.json({ error: "Missing file or target path" }, { status: 400 });
    }

    // Security: only allow replacing files in /assets/
    if (!targetPath.startsWith("/assets/")) {
      return NextResponse.json({ error: "Invalid target path" }, { status: 400 });
    }

    // Resolve full path
    const fullPath = path.join(process.cwd(), "public", targetPath);

    // Check if target file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "Target file not found" }, { status: 404 });
    }

    // Write the new file over the old one
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(fullPath, buffer);

    return NextResponse.json({ success: true, path: targetPath });
  } catch (err) {
    console.error("Replace error:", err);
    return NextResponse.json({ error: "Replace failed" }, { status: 500 });
  }
}
