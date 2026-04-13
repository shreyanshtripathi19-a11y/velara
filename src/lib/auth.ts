import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "velara-admin-secret-key-2026";

export interface AdminPayload {
  id: number;
  username: string;
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdmin(req: NextRequest): AdminPayload {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) throw new Error("Not authenticated");
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    throw new Error("Invalid or expired token");
  }
}
