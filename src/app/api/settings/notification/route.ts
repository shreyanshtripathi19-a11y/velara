import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const text = db.prepare("SELECT value FROM settings WHERE key = 'notification_text'").get() as { value: string } | undefined;
    const enabled = db.prepare("SELECT value FROM settings WHERE key = 'notification_enabled'").get() as { value: string } | undefined;
    return NextResponse.json({
      text: text?.value || "",
      enabled: enabled?.value === "true",
    });
  } catch {
    return NextResponse.json({ text: "", enabled: false });
  }
}
