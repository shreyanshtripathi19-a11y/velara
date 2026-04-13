"use client";
import { FormEvent, useState, useEffect } from "react";
import { useQuoteModal } from "@/context/QuoteModalContext";

export default function QuoteModal() {
  const { isOpen, product, category, close } = useQuoteModal();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", product: "", message: "" });

  // When modal opens, pre-select the category
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setError("");
      const preselect = category === "Windows" ? "Windows"
        : category === "Doors" ? "Entry Doors"
        : category === "Garage Doors" ? "Garage Doors"
        : category || "";
      setForm({ fullName: "", email: "", phone: "", product: preselect, message: "" });
    }
  }, [isOpen, category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Split full name into first/last
    const parts = form.fullName.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "-";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone: form.phone,
          email: form.email,
          product: form.product || product || "General Inquiry",
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        close();
      }, 2500);
    } catch {
      setError("Something went wrong. Please call us at 416-500-7610.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`quote-modal-overlay${isOpen ? " active" : ""}`}
      onClick={close}
    >
      <div className="quote-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quote-modal-close" onClick={close}>
          ✕
        </button>
        <p className="quote-modal-label">Free Estimate</p>
        <h2 className="quote-modal-title">
          {product ? `Get a Quote — ${product}` : "Request Your Free Estimate"}
        </h2>
        <p className="quote-modal-sub">
          Fill in your details and we&apos;ll get back within 1 business hour.
        </p>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--accent)" }}>
              ✓ Thank you!
            </p>
            <p style={{ fontSize: ".88rem", color: "rgba(0,0,0,.55)", marginTop: 8 }}>
              We&apos;ll be in touch shortly.
            </p>
          </div>
        ) : (
          <form className="quote-form" onSubmit={handleSubmit}>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
            <select name="product" value={form.product} onChange={handleChange} required>
              <option value="" disabled>
                Product Interest
              </option>
              <option value="Windows">Windows</option>
              <option value="Entry Doors">Entry Doors</option>
              <option value="Patio Doors">Patio Doors</option>
              <option value="Garage Doors">Garage Doors</option>
              <option value="Multiple Products">Multiple Products</option>
            </select>
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your project…" rows={3} />
            {error && <p style={{ color: "#e53e3e", fontSize: ".85rem", margin: 0 }}>{error}</p>}
            <button type="submit" className="quote-form-submit" disabled={loading}>
              {loading ? "Sending…" : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
