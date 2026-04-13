import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

// Public GET - for gallery page
export async function GET() {
  try {
    const db = getDb();
    const images = db.prepare("SELECT * FROM gallery_images ORDER BY createdAt DESC").all();
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}

// Upload image
export async function POST(req: NextRequest) {
  try {
    verifyAdmin(req);
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const alt = (formData.get("alt") as string) || "";
    const category = (formData.get("category") as string) || "windows";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "assets", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    // Generate unique filename
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const src = `/assets/uploads/${filename}`;

    // Save to DB
    const db = getDb();
    const result = db.prepare("INSERT INTO gallery_images (src, alt, category) VALUES (?, ?, ?)").run(src, alt, category);

    return NextResponse.json({
      success: true,
      image: { id: result.lastInsertRowid, src, alt, category },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Delete image
export async function DELETE(req: NextRequest) {
  try {
    verifyAdmin(req);
    const { id } = await req.json();
    const db = getDb();

    // Get image info before deleting
    const image = db.prepare("SELECT * FROM gallery_images WHERE id = ?").get(id) as { src: string } | undefined;
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete file from disk if it's an uploaded file
    if (image.src.startsWith("/assets/uploads/")) {
      const filePath = path.join(process.cwd(), "public", image.src);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete from DB
    db.prepare("DELETE FROM gallery_images WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
