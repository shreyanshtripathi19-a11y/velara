import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getDb } from "@/lib/db";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, product, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !email || !product) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to database first (so we never lose a lead)
    try {
      const db = getDb();
      db.prepare(
        "INSERT INTO contacts (firstName, lastName, phone, email, product, message) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(firstName, lastName, phone, email, product, message || "");
    } catch (dbErr) {
      console.error("DB save error:", dbErr);
    }

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; font-size: 20px; margin: 0;">New Lead from Velara Website</h1>
        </div>
        <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; width: 140px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600; font-size: 15px;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px;"><a href="tel:${phone}" style="color: #6c3ce0; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px;"><a href="mailto:${email}" style="color: #6c3ce0; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Product Interest</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600; font-size: 15px;">${product}</td>
            </tr>
            ${message ? `
            <tr>
              <td style="padding: 12px 0; color: #888; font-size: 13px; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; font-size: 15px; line-height: 1.6;">${message.replace(/\n/g, "<br/>")}</td>
            </tr>
            ` : ""}
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #f8f7ff; border-radius: 8px; font-size: 13px; color: #666;">
            Submitted from <strong>velara.ca</strong> contact form on ${new Date().toLocaleString("en-CA", { timeZone: "America/Toronto" })}
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Velara Website" <${process.env.GMAIL_USER}>`,
      to: "info@velara.ca, rafi@velara.ca",
      replyTo: email,
      subject: `New Lead: ${firstName} ${lastName} — ${product}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
