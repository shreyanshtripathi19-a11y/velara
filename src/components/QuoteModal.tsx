"use client";
import { FormEvent, useState } from "react";
import { useQuoteModal } from "@/context/QuoteModalContext";

export default function QuoteModal() {
  const { isOpen, product, category, close } = useQuoteModal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      close();
    }, 2000);
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
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <input type="tel" placeholder="Phone" required />
            <select defaultValue={category || ""}>
              <option value="" disabled>
                Product Interest
              </option>
              <option value="windows">Windows</option>
              <option value="doors">Doors</option>
              <option value="garage">Garage Doors</option>
              <option value="multiple">Multiple Products</option>
            </select>
            <textarea placeholder="Tell us about your project…" rows={3} />
            <button type="submit" className="quote-form-submit">
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
