import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    verifyAdmin(req);
    const db = getDb();
    const contacts = db.prepare("SELECT * FROM contacts ORDER BY createdAt DESC").all();
    return NextResponse.json({ contacts });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    verifyAdmin(req);
    const { id, isRead } = await req.json();
    const db = getDb();
    db.prepare("UPDATE contacts SET isRead = ? WHERE id = ?").run(isRead ? 1 : 0, id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    verifyAdmin(req);
    const { id } = await req.json();
    const db = getDb();
    db.prepare("DELETE FROM contacts WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
