"use client";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PageHero } from "@/components/Sections";

export default function ContactPage() {
  useScrollReveal();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      {/* ── Hero ── */}
      <PageHero
        label="Reach Out"
        title="Contact Us."
        sub="Get a free estimate or just ask us a question — we're here to help."
        bgSrc="https://static.wixstatic.com/media/d9a8f1_0c23233c1caa458faa4b47cfd72b53cf~mv2.jpeg/v1/fill/w_1920,h_1076,al_c,q_90/d9a8f1_0c23233c1caa458faa4b47cfd72b53cf~mv2.jpeg"
      />

      {/* ── Body ── */}
      <div className="contact-body sr">
        {/* Form */}
        <div className="cform">
          <h2>Send us a<br /><em>message.</em></h2>
          <p className="sub">Fill out the form and one of our experts will reach out within the next few minutes with your personalized estimate.</p>

          {submitted ? (
            <p style={{ fontSize: "1.05rem", color: "var(--accent)", fontWeight: 600, marginTop: 32 }}>Thank you! We&apos;ll be in touch within the next few minutes.</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div className="frow">
                <div className="ff"><label>First Name</label><input type="text" placeholder="John" required /></div>
                <div className="ff"><label>Last Name</label><input type="text" placeholder="Smith" required /></div>
              </div>
              <div className="ff"><label>Phone Number</label><input type="tel" placeholder="(416) 555-0123" required /></div>
              <div className="ff"><label>Email Address</label><input type="email" placeholder="john@example.com" required /></div>
              <div className="ff">
                <label>Product Interest</label>
                <select defaultValue="" required>
                  <option value="" disabled>Select a product…</option>
                  <option>Windows</option>
                  <option>Entry Doors</option>
                  <option>Patio Doors</option>
                  <option>Garage Doors</option>
                  <option>Multiple Products</option>
                </select>
              </div>
              <div className="ff"><label>Message (optional)</label><textarea placeholder="Tell us about your project…" /></div>
              <button className="fsub" type="submit">Send My Request →</button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="cinfo">
          <h2>We&apos;d love to<br /><em>hear from you.</em></h2>
          <p className="sub">Whether you&apos;re replacing one window or renovating your entire home, our team is ready to help every step of the way.</p>

          <div className="cdet">
            <div className="cdet-ico"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.34 12 19.79 19.79 0 011.27 3.36 2 2 0 013.26 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg></div>
            <div className="cdet-text"><strong>Phone</strong><a href="tel:4165007610">416-500-7610</a></div>
          </div>

          <div className="cdet">
            <div className="cdet-ico"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></div>
            <div className="cdet-text"><strong>Email</strong><a href="mailto:info@velara.ca">info@velara.ca</a></div>
          </div>

          <div className="cdet">
            <div className="cdet-ico"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg></div>
            <div className="cdet-text"><strong>Address</strong><span>200 Connie Crescent, Unit 7<br />Concord, ON L4K 1L3</span></div>
          </div>

          <div className="cdet">
            <div className="cdet-ico"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></div>
            <div className="cdet-text"><strong>Instagram</strong><a href="https://instagram.com/velara.ca" target="_blank" rel="noopener noreferrer">@velara.ca</a></div>
          </div>

          <div className="chours">
            <h4>Business Hours</h4>
            <div className="hr"><span>Monday – Friday</span><span>8:00 AM – 7:00 PM</span></div>
            <div className="hr"><span>Saturday</span><span>10:00 AM – 3:00 PM</span></div>
            <div className="hr"><span>Sunday</span><span>Closed</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
