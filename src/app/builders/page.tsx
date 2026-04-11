"use client";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useVideoObserver } from "@/hooks/useVideoObserver";

export default function BuildersPage() {
  useScrollReveal();
  useVideoObserver();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="builders-page">
      {/* ── Hero ── */}
      <section style={{ padding: "110px 24px clamp(48px,6vw,72px)", background: "var(--white)", textAlign: "center" }}>
        <div className="hm-hero-badge sr" style={{ animation: "none", opacity: 1 }}>Trade Program</div>
        <h1 className="hm-title sr d1" style={{ animation: "none", opacity: 1, color: "var(--accent)" }}>Your builds<br />deserve better.</h1>
        <p className="sr d2" style={{ fontSize: "1.1rem", fontWeight: 300, color: "rgba(0,0,0,.5)", maxWidth: 620, margin: "0 auto 36px", lineHeight: 1.7 }}>
          From custom luxury homes to 500-unit towers — Velara supplies Ontario&apos;s most ambitious builders with premium windows, doors, and garage doors at contractor-exclusive pricing.
        </p>
        <div className="sr d3" style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <span className="hm-cta-primary" onClick={() => document.getElementById("builders-form")?.scrollIntoView({ behavior: "smooth" })} style={{ cursor: "pointer" }}>Open a Trade Account ›</span>
          <span className="hm-cta-ghost" onClick={() => { window.location.href = "tel:4165007610"; }} style={{ cursor: "pointer" }}>Call 416-500-7610 ›</span>
        </div>
      </section>

      {/* ── "From blueprint to build" Video Panel ── */}
      <section style={{ background: "var(--white)", textAlign: "center", paddingTop: "clamp(48px,6vw,72px)" }}>
        <p className="hm-panel-label" style={{ position: "static", opacity: 1, transform: "none", color: "rgba(0,0,0,.4)", fontSize: ".75rem", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Trade Program</p>
        <h2 className="hm-panel-h" style={{ position: "static", opacity: 1, transform: "none", color: "var(--accent)", marginBottom: 0 }}>From blueprint<br /><em style={{ color: "var(--accent)" }}>to build.</em></h2>
        <div className="hm-panel hm-panel-blend" style={{ marginTop: 24, background: "var(--white)" }}>
          <video className="hm-panel-bg hm-scroll-video" muted playsInline style={{ background: "var(--white)" }}>
            <source src="/assets/builders-hero3.mp4" type="video/mp4" />
          </video>
          <div className="hm-panel-edge-l" /><div className="hm-panel-edge-r" />
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="hm-stats-strip sr" style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        {[
          { n: "500+", l: "Projects Supplied" },
          { n: "1hr", l: "Quote Turnaround Time" },
          { n: "30%", l: "Below Retail" },
          { n: "0", l: "Delays. Ever." },
        ].map((s, i) => (
          <div key={s.l} style={{ display: "contents" }}>
            <div className={`hm-strip-item sr d${i + 1}`}>
              <div className="hm-strip-n">{s.n}</div>
              <div className="hm-strip-l">{s.l}</div>
            </div>
            {i < 3 && <div className="hm-strip-div" />}
          </div>
        ))}
      </div>

      {/* ── Project Types ── */}
      <section className="sr" style={{ padding: "clamp(48px,5vw,72px) 24px", background: "var(--white)" }}>
        <div className="center" style={{ marginBottom: 0 }}>
          <p className="ch-label">What We Supply</p>
          <h2 className="ch-h center" style={{ color: "var(--accent)" }}>Every scale.<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>Every scope.</em></h2>
          <p style={{ fontSize: ".97rem", color: "rgba(0,0,0,.5)", maxWidth: 580, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>Whether you&apos;re framing a single custom home or managing a multi-phase development — we deliver product, pricing, and support built for your timeline.</p>
        </div>
        <div className="perks-grid">
          {/* Custom Homes */}
          <div className="perk sr d1">
            <div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg></div>
            <h3>Custom Homes</h3>
            <p>Premium fenestration for luxury custom builds. Architect-spec support, custom sizing, and finishes that match your client&apos;s vision.</p>
          </div>
          {/* Townhome Complexes */}
          <div className="perk sr d2">
            <div className="perk-ico"><svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 22 12 22 20 16 16" /><rect x="1" y="18" width="21" height="4" rx="1" /></svg></div>
            <h3>Townhome Complexes</h3>
            <p>Consistent product across 20, 50, or 200+ units. Bulk pricing, phased delivery, and a single point of contact from start to occupancy.</p>
          </div>
          {/* High-Rise & Mid-Rise */}
          <div className="perk sr d3">
            <div className="perk-ico"><svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="16" y2="18" /></svg></div>
            <h3>High-Rise &amp; Mid-Rise</h3>
            <p>Large-scale curtain wall and window packages for multi-storey residential and mixed-use towers. Engineered for code, delivered on schedule.</p>
          </div>
          {/* Commercial & Mixed-Use */}
          <div className="perk sr d1">
            <div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg></div>
            <h3>Commercial &amp; Mixed-Use</h3>
            <p>Storefronts, office buildings, retail plazas. We supply commercial-grade products that meet project specs and municipal requirements.</p>
          </div>
          {/* Renovations & Retrofits */}
          <div className="perk sr d2">
            <div className="perk-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg></div>
            <h3>Renovations &amp; Retrofits</h3>
            <p>Replacement windows and doors for renovation contractors. Fast measurements, faster delivery. Keep your reno projects profitable.</p>
          </div>
          {/* Subdivision Builders */}
          <div className="perk sr d3">
            <div className="perk-ico"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg></div>
            <h3>Subdivision Builders</h3>
            <p>Full-community supply packages. Standardized specs across phases, volume pricing that improves your margins on every lot.</p>
          </div>
        </div>
      </section>

      {/* ── Street-level builders video ── */}
      <section className="hm-panel hm-panel-blend builders-street-video" style={{ background: "var(--white)", height: "auto", minHeight: "auto", position: "relative" }}>
        <video className="hm-scroll-video" muted playsInline style={{ width: "100%", display: "block", objectFit: "contain", background: "var(--white)", filter: "brightness(1.06)" }}>
          <source src="/assets/builders-street.mp4" type="video/mp4" />
        </video>
        <div className="hm-panel-edge-l" /><div className="hm-panel-edge-r" />
      </section>

      {/* ── Why Velara for Builders ── */}
      <section className="sr" style={{ padding: "clamp(48px,5vw,72px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="center" style={{ marginBottom: 0 }}>
          <p className="ch-label">The Velara Advantage</p>
          <h2 className="ch-h center" style={{ color: "var(--accent)" }}>Built for<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>builders.</em></h2>
          <p style={{ fontSize: ".97rem", color: "rgba(0,0,0,.5)", maxWidth: 580, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>We&apos;re not a big-box supplier. We&apos;re a partner who understands that your reputation depends on every window, every door, every deadline.</p>
        </div>
        <div className="perks-grid">
          {/* Contractor-Only Pricing */}
          <div className="perk sr d1">
            <div className="perk-ico"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg></div>
            <h3>Contractor-Only Pricing</h3>
            <p>Margins that make sense. Tiered volume discounts that increase as your project scales. No retail markup, ever.</p>
          </div>
          {/* Phased Delivery */}
          <div className="perk sr d2">
            <div className="perk-ico"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div>
            <h3>Phased Delivery</h3>
            <p>We deliver to your schedule, not ours. Staged shipments aligned to your construction phases — no warehouse needed on your end.</p>
          </div>
          {/* Dedicated Account Rep */}
          <div className="perk sr d3">
            <div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg></div>
            <h3>Dedicated Account Rep</h3>
            <p>One person who knows your projects, your specs, and your timeline. Direct line. No call centre. No runaround.</p>
          </div>
          {/* Site-Ready Quality */}
          <div className="perk sr d1">
            <div className="perk-ico"><svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg></div>
            <h3>Site-Ready Quality</h3>
            <p>Every unit inspected before it ships. No defects on site, no warranty callbacks, no delays explaining problems to your clients.</p>
          </div>
          {/* Industry-Best Lead Times */}
          <div className="perk sr d2">
            <div className="perk-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
            <h3>Industry-Best Lead Times</h3>
            <p>Canadian-manufactured with lead times built for construction speed. Standard orders ship in weeks, not months.</p>
          </div>
          {/* Simplified Paperwork */}
          <div className="perk sr d3">
            <div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg></div>
            <h3>Simplified Paperwork</h3>
            <p>Fast quotes, clean invoicing, PO matching. We handle the admin so you can focus on building.</p>
          </div>
        </div>
      </section>

      {/* ── CTA Form ── */}
      <section className="ch-estimate sr" id="builders-form">
        <p className="ch-label">Start Here</p>
        <h2 className="ch-h" style={{ color: "var(--accent)" }}>Open your<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>trade account.</em></h2>
        <p className="ch-p">Tell us about your next project. We&apos;ll have a dedicated rep reach out with trade pricing within one business day.</p>
        {submitted ? (
          <p style={{ fontSize: "1.1rem", color: "var(--accent)", fontWeight: 600, marginTop: 32 }}>Thank you! A rep will be in touch shortly.</p>
        ) : (
          <form className="est-form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <input type="text" placeholder="Company Name" required />
            <input type="text" placeholder="Contact Name" required />
            <input type="tel" placeholder="Phone Number" required />
            <select defaultValue="" required>
              <option value="" disabled>Project Scale</option>
              <option>Custom Home (1-5 units)</option>
              <option>Townhome Complex (6-50 units)</option>
              <option>Mid-Rise (50-200 units)</option>
              <option>High-Rise (200+ units)</option>
              <option>Commercial / Mixed-Use</option>
              <option>Subdivision / Multi-Phase</option>
              <option>Renovation Contractor</option>
            </select>
            <button className="est-btn" type="submit">Get Trade Pricing →</button>
          </form>
        )}
        <p className="est-note">No commitment required — just a conversation about what we can do for your next build</p>
      </section>
    </div>
  );
}
