import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    verifyAdmin(req);
    const db = getDb();
    const totalContacts = (db.prepare("SELECT COUNT(*) as c FROM contacts").get() as { c: number }).c;
    const unreadContacts = (db.prepare("SELECT COUNT(*) as c FROM contacts WHERE isRead = 0").get() as { c: number }).c;
    const weekContacts = (db.prepare("SELECT COUNT(*) as c FROM contacts WHERE createdAt >= datetime('now', '-7 days')").get() as { c: number }).c;
    const totalImages = (db.prepare("SELECT COUNT(*) as c FROM gallery_images").get() as { c: number }).c;
    const recentContacts = db.prepare("SELECT * FROM contacts ORDER BY createdAt DESC LIMIT 5").all();

    return NextResponse.json({
      totalContacts,
      unreadContacts,
      weekContacts,
      totalImages,
      recentContacts,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
