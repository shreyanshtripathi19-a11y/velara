"use client";
import { useState, FormEvent } from "react";
import { useVideoObserver } from "@/hooks/useVideoObserver";

export default function EmergencyPage() {
  useVideoObserver();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", address: "",
    emergencyType: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const parts = form.fullName.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "-";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName,
          phone: form.phone, email: form.email,
          product: `🚨 EMERGENCY — ${form.emergencyType || "General"}`,
          message: `📍 Address: ${form.address || "Not provided"}\n\n${form.message || ""}`.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setShowForm(false); }, 3000);
    } catch {
      setError("Something went wrong. Please call us at 416-333-9525.");
    } finally {
      setLoading(false);
    }
  };

  const openForm = () => {
    setSubmitted(false); setError("");
    setForm({ fullName: "", phone: "", email: "", address: "", emergencyType: "", message: "" });
    setShowForm(true);
  };

  return (
    <>
    <main className="homepage">

      {/* Hero */}
      <section style={{ padding: "clamp(90px,10vh,100px) 24px clamp(24px,3vh,36px)", background: "var(--white)", textAlign: "center" }}>
        <p className="ch-label">24/7 Emergency Services</p>
        <h1  style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2.8rem,6vw,4.5rem)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-.03em", lineHeight: 1.08, margin: "0 auto", maxWidth: 800 }}>
          When disaster strikes,<br />
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>we&apos;re there.</em>
        </h1>
        <p  style={{ fontSize: "clamp(1rem,1.2vw,1.15rem)", color: "rgba(0,0,0,.7)", maxWidth: 620, margin: "20px auto 0", fontWeight: 300, lineHeight: 1.7 }}>
          Fast, reliable emergency board-up and glass replacement for homes and businesses across the GTA. Available around the clock — because emergencies don&apos;t wait.
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a className="hm-cta-primary" href="tel:4163339525" style={{ textDecoration: "none" }}>Call now — 416-333-9525 ›</a>
          <button className="hm-cta-ghost" onClick={openForm} style={{ border: "none", cursor: "pointer" }}>Get a free estimate ›</button>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="hm-stats-strip" style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="hm-strip-item">
          <div className="hm-strip-n" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "var(--accent)" }}>24/7</div>
          <div className="hm-strip-l">Emergency Response</div>
        </div>
        <div className="hm-strip-item">
          <div className="hm-strip-n" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)" }}>Same-Hour</div>
          <div className="hm-strip-l">Dispatch Available</div>
        </div>
        <div className="hm-strip-item">
          <div className="hm-strip-n" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)" }}>Licensed</div>
          <div className="hm-strip-l">Insured &amp; WSIB</div>
        </div>
        <div className="hm-strip-item">
          <div className="hm-strip-n" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "var(--accent)" }}>25-Year</div>
          <div className="hm-strip-l">Warranty</div>
        </div>
      </div>

      {/* What We Cover */}
      <section style={{ padding: "clamp(32px,4vw,56px) 24px", background: "var(--white)", overflow: "hidden" }}>
        <div className="center" style={{ marginBottom: 64 }}>
          <p className="ch-label">Emergency Services</p>
          <h2 className="ch-h" style={{ color: "var(--ink)" }}>We handle <em style={{ color: "var(--accent)" }}>everything.</em></h2>
          <p  style={{ fontSize: ".97rem", color: "rgba(0,0,0,.5)", maxWidth: 560, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>
            From break-ins to storms, fire damage to renovation mishaps — Velara&apos;s emergency team secures your property fast with professional board-up and glass replacement services.
          </p>
        </div>
        <div className="perks-grid">
          <div className="perk"><div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg></div><h3>Residential Board-Ups</h3><p>Window and door board-ups for homes. We secure your property quickly so you can rest easy while permanent repairs are arranged.</p></div>
          <div className="perk"><div className="perk-ico"><svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><polyline points="16 21 16 3 8 3 8 21" /></svg></div><h3>Storefront &amp; Commercial</h3><p>Storefront glass, entry doors, and commercial security closures. We minimize downtime and protect your business from further loss.</p></div>
          <div className="perk"><div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div><h3>Break-In &amp; Vandalism</h3><p>Immediate response to break-ins and vandalism. We secure the breach, protect your property, and help you feel safe again.</p></div>
          <div className="perk"><div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M18 10h-4V6" /><path d="M14 10l7.64-7.64" /><path d="M21 3l-7 7" /><circle cx="12" cy="12" r="10" /></svg></div><h3>Storm &amp; Impact Damage</h3><p>High winds, hail, or falling debris — we respond immediately to storm damage with durable, weather-sealed board-up solutions.</p></div>
          <div className="perk"><div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.14 0-5.5 3.5-7.5-2.5 5 .5 4 1.5 8-.34 1.45-1.63 2.5-3 2.5s-2.5-1.12-2.5-2.5z" /><path d="M12 22c-4.97 0-9-2.69-9-6v-1c3 1 5.5 0 9 0s6 1 9 0v1c0 3.31-4.03 6-9 6z" /></svg></div><h3>Fire &amp; Disaster Response</h3><p>After a fire or disaster, we board up damaged openings to prevent further damage, theft, and weather exposure while you rebuild.</p></div>
          <div className="perk"><div className="perk-ico"><svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" /><polygon points="23 7 16 12 16 7" /><line x1="1" y1="20" x2="23" y2="20" /></svg></div><h3>Construction &amp; Renovation</h3><p>Temporary window and door sealing for construction sites and renovations. Keep the elements out and your project on track.</p></div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "clamp(32px,4vw,56px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="center" style={{ marginBottom: 64 }}>
          <p className="ch-label">Our Process</p>
          <h2 className="ch-h" style={{ color: "var(--ink)" }}>Fast. Professional.<br /><em style={{ color: "var(--accent)" }}>Secure.</em></h2>
          <p  style={{ fontSize: ".97rem", color: "rgba(0,0,0,.5)", maxWidth: 560, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>
            From your first call to follow-up, here&apos;s how we handle every emergency — quickly, safely, and with clear communication at every step.
          </p>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
          <div  style={{ textAlign: "center", padding: "32px 20px", border: "1px solid var(--rule)", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontFamily: "var(--font-d)", fontSize: "2.4rem", fontWeight: 700, color: "var(--accent)", display: "block", marginBottom: 12 }}>01</span>
            <h3 style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "1.1rem", marginBottom: 8, color: "var(--ink)" }}>Immediate Dispatch</h3>
            <p style={{ fontSize: ".88rem", color: "rgba(0,0,0,.55)", lineHeight: 1.65, fontWeight: 300 }}>Call us anytime — day or night. We dispatch our nearest emergency team to your location within minutes.</p>
          </div>
          <div  style={{ textAlign: "center", padding: "32px 20px", border: "1px solid var(--rule)", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontFamily: "var(--font-d)", fontSize: "2.4rem", fontWeight: 700, color: "var(--accent)", display: "block", marginBottom: 12 }}>02</span>
            <h3 style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "1.1rem", marginBottom: 8, color: "var(--ink)" }}>Assess &amp; Secure</h3>
            <p style={{ fontSize: ".88rem", color: "rgba(0,0,0,.55)", lineHeight: 1.65, fontWeight: 300 }}>Our team assesses the damage on-site, prepares the area safely, and installs custom-cut, durable board-up panels with weather-sealed fastening.</p>
          </div>
          <div  style={{ textAlign: "center", padding: "32px 20px", border: "1px solid var(--rule)", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontFamily: "var(--font-d)", fontSize: "2.4rem", fontWeight: 700, color: "var(--accent)", display: "block", marginBottom: 12 }}>03</span>
            <h3 style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "1.1rem", marginBottom: 8, color: "var(--ink)" }}>Replace &amp; Restore</h3>
            <p style={{ fontSize: ".88rem", color: "rgba(0,0,0,.55)", lineHeight: 1.65, fontWeight: 300 }}>Once the emergency is secured, we schedule your permanent glass or door replacement — manufactured in our own facility for the fastest turnaround possible.</p>
          </div>
        </div>
      </section>

      {/* Why Velara Emergency */}
      <section style={{ padding: "clamp(32px,4vw,56px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,4vw,56px)", alignItems: "center" }}>
          <div >
            <p className="ch-label">The Velara Advantage</p>
            <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-.02em", lineHeight: 1.1, marginBottom: 20 }}>
              Not just a board-up.<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>A full solution.</em>
            </h2>
            <p style={{ fontSize: ".95rem", color: "rgba(0,0,0,.7)", lineHeight: 1.8, fontWeight: 300, marginBottom: 16 }}>
              Most emergency board-up companies show up, nail some plywood to your wall, and leave. You&apos;re stuck calling another company for the actual replacement — waiting weeks, paying twice, and dealing with two different contractors.
            </p>
            <p style={{ fontSize: ".95rem", color: "rgba(0,0,0,.7)", lineHeight: 1.8, fontWeight: 300, marginBottom: 16 }}>
              <span style={{ color: "var(--accent)", fontWeight: 500 }}>Velara is different.</span> We&apos;re the manufacturer. We board up your property and then build your replacement windows or doors in our own factory. One company, one call, one warranty — from emergency to finished product.
            </p>
            <p style={{ fontSize: ".95rem", color: "var(--ink)", lineHeight: 1.8, fontWeight: 500 }}>
              Clear upfront pricing. No hidden fees. No middlemen. Just fast, honest service backed by our 25-year warranty.
            </p>
          </div>
          <div  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { n: "1", l: ["Call for", "everything"] },
              { n: "24/7", l: ["Always", "available"] },
              { n: "25yr", l: ["Warranty on", "replacements"] },
              { n: "$0", l: ["Hidden fees", "or surprises"] },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-md)", padding: "32px 24px", textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-d)", fontSize: "2.4rem", fontWeight: 700, color: "var(--accent)", display: "block" }}>{s.n}</span>
                <p style={{ fontSize: ".78rem", color: "rgba(0,0,0,.6)", marginTop: 8, lineHeight: 1.4 }}>{s.l[0]}<br />{s.l[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serving All of GTA */}
      <section style={{ padding: "clamp(32px,4vw,56px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="center" style={{ marginBottom: 48 }}>
          <p className="ch-label">Service Area</p>
          <h2 className="ch-h center" style={{ color: "var(--accent)" }}>Proudly serving the<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>Greater Toronto Area.</em></h2>
          <p  style={{ fontSize: ".97rem", color: "rgba(0,0,0,.5)", maxWidth: 560, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>
            Our emergency teams are stationed across the GTA for the fastest possible response — wherever you are.
          </p>
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {["Toronto", "North York", "Etobicoke", "Scarborough", "Mississauga", "Brampton", "Vaughan", "Richmond Hill", "Markham", "Oakville", "Ajax", "Pickering"].map((city) => (
            <span key={city} style={{ display: "inline-block", padding: "10px 22px", border: "1px solid var(--rule)", borderRadius: "var(--radius-pill)", fontSize: ".88rem", color: "rgba(0,0,0,.65)", fontWeight: 400 }}>
              {city}
            </span>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "clamp(32px,4vw,56px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="center" style={{ marginBottom: 48 }}>
          <p className="ch-label">FAQ</p>
          <h2 className="ch-h center" style={{ color: "var(--ink)" }}>Common <em style={{ color: "var(--accent)" }}>questions.</em></h2>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: 0 }}>
          {[
            { q: "How fast can you respond to an emergency?", a: "We offer same-hour dispatch for emergencies across the GTA. Our teams are stationed strategically so we can reach most locations within 30-60 minutes of your call." },
            { q: "Do you only do board-ups, or can you replace the glass too?", a: "Both. We secure your property immediately with a professional board-up, then manufacture your permanent replacement windows or doors in our own factory. One company handles everything — no need to call a second contractor." },
            { q: "Are you available on weekends and holidays?", a: "Yes. Our emergency line is available 24 hours a day, 7 days a week, 365 days a year — including weekends and holidays. Emergencies don't follow a schedule, and neither do we." },
            { q: "Do you handle both residential and commercial properties?", a: "Absolutely. We serve homeowners, property managers, storefronts, offices, and construction sites. Whether it's a broken patio door or a shattered storefront, we've got you covered." },
            { q: "How much does an emergency board-up cost?", a: "We provide clear, upfront pricing with no hidden fees. The cost depends on the size and scope of the damage, but we'll give you an honest quote before any work begins. No surprises." },
            { q: "Are you licensed and insured?", a: "Yes. Velara is fully licensed, insured, and WSIB-compliant. You can trust that our team operates to the highest professional standards on every job." },
          ].map((faq, i) => (
            <details key={i} style={{ borderBottom: i < 5 ? "1px solid var(--rule)" : undefined, padding: "20px 0", cursor: "pointer" }}>
              <summary style={{ fontFamily: "var(--font-d)", fontWeight: 600, fontSize: "1rem", color: "var(--ink)", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {faq.q}
                <span style={{ color: "var(--accent)", fontSize: "1.2rem", fontWeight: 300, transition: "transform .2s" }}>+</span>
              </summary>
              <p style={{ fontSize: ".9rem", color: "rgba(0,0,0,.6)", lineHeight: 1.75, fontWeight: 300, marginTop: 12, paddingRight: 32 }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "clamp(32px,4vw,56px) 24px", background: "var(--white)", textAlign: "center", borderTop: "1px solid var(--rule)" }}>
        <p className="ch-label">Ready When You Need Us</p>
        <h2 className="ch-h center" style={{ color: "var(--accent)" }}>Emergency?<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>Call now.</em></h2>
        <p  style={{ fontSize: "clamp(1rem,1.2vw,1.15rem)", color: "rgba(0,0,0,.5)", maxWidth: 520, margin: "16px auto 0", fontWeight: 300, lineHeight: 1.7 }}>
          Don&apos;t wait. Our emergency team is standing by 24/7 to secure your property and get you back to normal — fast.
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a className="hm-cta-primary" href="tel:4163339525" style={{ textDecoration: "none" }}>Call 416-333-9525 ›</a>
          <button className="hm-cta-ghost" onClick={openForm} style={{ border: "none", cursor: "pointer" }}>Get a free estimate ›</button>
        </div>
      </section>

    </main>

    {/* ═══ Emergency Form Modal — outside main to avoid stacking context ═══ */}
    <div
      className={`quote-modal-overlay${showForm ? " active" : ""}`}
      onClick={() => setShowForm(false)}
    >
      <div className="quote-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quote-modal-close" onClick={() => setShowForm(false)}>✕</button>
        <p className="quote-modal-label">Immediate Response</p>
        <h2 className="quote-modal-title">24/7 Emergency Service</h2>
        <p className="quote-modal-sub">
          Fill in your details and our emergency team will contact you immediately.
        </p>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--accent)" }}>✓ Request Received!</p>
            <p style={{ fontSize: ".88rem", color: "rgba(0,0,0,.55)", marginTop: 8 }}>
              Our emergency team will contact you shortly.
            </p>
          </div>
        ) : (
          <form className="quote-form" onSubmit={handleSubmit}>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
            <select name="emergencyType" value={form.emergencyType} onChange={handleChange} required>
              <option value="" disabled>Type of Emergency</option>
              <option value="Break-In / Vandalism">Break-In / Vandalism</option>
              <option value="Storm Damage">Storm Damage</option>
              <option value="Fire Damage">Fire Damage</option>
              <option value="Broken Window">Broken Window</option>
              <option value="Broken Door">Broken Door</option>
              <option value="Storefront / Commercial">Storefront / Commercial</option>
              <option value="Board-Up Needed">Board-Up Needed</option>
              <option value="Other Emergency">Other Emergency</option>
            </select>
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Describe the situation…" rows={3} />
            {error && <p style={{ color: "#e53e3e", fontSize: ".85rem", margin: 0 }}>{error}</p>}
            <button type="submit" className="quote-form-submit" disabled={loading}>
              {loading ? "Sending…" : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>

    </>
  );
}
