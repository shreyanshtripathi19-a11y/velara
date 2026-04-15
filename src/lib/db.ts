import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const dbPath = path.join(DATA_DIR, "velara.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(dbPath);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  initTables(_db);
  return _db;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      product TEXT NOT NULL,
      message TEXT DEFAULT '',
      isRead INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      src TEXT NOT NULL,
      alt TEXT DEFAULT '',
      category TEXT DEFAULT 'windows',
      sortOrder INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL
    );
  `);

  // Seed default admin if none exists
  const adminCount = db.prepare("SELECT COUNT(*) as c FROM admin_users").get() as { c: number };
  if (adminCount.c === 0) {
    const hash = bcrypt.hashSync("Velara@2026#", 10);
    db.prepare("INSERT INTO admin_users (username, passwordHash) VALUES (?, ?)").run("admin", hash);
  }

  // Seed default notification bar
  const notif = db.prepare("SELECT * FROM settings WHERE key = 'notification_text'").get();
  if (!notif) {
    db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("notification_text", "SPRING SPECIAL – 25% OFF THIS MONTH! LIMITED TIME OFFER");
    db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("notification_enabled", "true");
  }

  // Migration: add sortOrder column if missing (existing DBs)
  try {
    db.prepare("SELECT sortOrder FROM gallery_images LIMIT 1").get();
  } catch {
    db.exec("ALTER TABLE gallery_images ADD COLUMN sortOrder INTEGER DEFAULT 0");
    // Backfill existing rows with sequential sort order
    const rows = db.prepare("SELECT id FROM gallery_images ORDER BY createdAt ASC").all() as { id: number }[];
    const update = db.prepare("UPDATE gallery_images SET sortOrder = ? WHERE id = ?");
    rows.forEach((row, i) => update.run(i, row.id));
  }

  // Seed existing gallery images if empty
  const imgCount = db.prepare("SELECT COUNT(*) as c FROM gallery_images").get() as { c: number };
  if (imgCount.c === 0) {
    const seedImages = [
      { src: "/assets/reviews/project-1.jpg", alt: "Window installation — Oakville", category: "windows" },
      { src: "/assets/reviews/project-2.jpg", alt: "Casement windows — Mississauga", category: "windows" },
      { src: "/assets/reviews/project-3.jpg", alt: "Garage door — Richmond Hill", category: "garage" },
      { src: "/assets/reviews/project-4.jpg", alt: "Bay window — Markham", category: "windows" },
      { src: "/assets/reviews/project-5.jpg", alt: "Picture windows — Brampton", category: "windows" },
      { src: "/assets/reviews/project-6.jpg", alt: "Modern garage — Newmarket", category: "garage" },
      { src: "/assets/doors/entry-door.jpg", alt: "Entry door — Vaughan", category: "doors" },
      { src: "/assets/doors/patio-door.jpg", alt: "Patio door — Burlington", category: "doors" },
      { src: "/assets/doors/double-door.jpg", alt: "Double entry — Toronto", category: "doors" },
      { src: "/assets/doors/sidelights.jpg", alt: "Sidelights — Etobicoke", category: "doors" },
    ];
    const stmt = db.prepare("INSERT INTO gallery_images (src, alt, category, sortOrder) VALUES (?, ?, ?, ?)");
    seedImages.forEach((img, i) => stmt.run(img.src, img.alt, img.category, i));
  }
}
