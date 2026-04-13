import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    verifyAdmin(req);
    const db = getDb();
    const text = db.prepare("SELECT value FROM settings WHERE key = 'notification_text'").get() as { value: string } | undefined;
    const enabled = db.prepare("SELECT value FROM settings WHERE key = 'notification_enabled'").get() as { value: string } | undefined;
    return NextResponse.json({
      text: text?.value || "",
      enabled: enabled?.value === "true",
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    verifyAdmin(req);
    const { text, enabled } = await req.json();
    const db = getDb();
    if (text !== undefined) {
      db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('notification_text', ?)").run(text);
    }
    if (enabled !== undefined) {
      db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('notification_enabled', ?)").run(enabled ? "true" : "false");
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
