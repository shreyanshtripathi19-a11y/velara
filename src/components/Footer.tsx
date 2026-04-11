"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="ft-grid">
        <div className="ft-brand">
          <div className="logo"><img src="/assets/Velara Windows & Doors Logo white.png" alt="Velara" className="footer-logo-img"/></div>
          <p>Premium windows, doors, and garage doors for Ontario homes.</p>
          <a className="phone led-phone" href="tel:4165007610">416-500-7610</a>
        </div>
        <div className="ft-col">
          <h5>Products</h5>
          <ul>
            <li><Link href="/windows">Windows</Link></li>
            <li><Link href="/doors">Doors</Link></li>
            <li><Link href="/garage">Garage Doors</Link></li>
          </ul>
        </div>
        <div className="ft-col">
          <h5>Company</h5>
          <ul>
            <li><Link href="/builders">Builders</Link></li>
            <li><Link href="/why-us">Why Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="ft-col">
          <h5>Visit Us</h5>
          <ul>
            <li><a>200 Connie Crescent, Unit 7</a></li>
            <li><a>Concord, ON L4K 1L3</a></li>
            <li><a href="https://instagram.com/velara.ca" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://facebook.com/profile.php?id=61552553759415" target="_blank" rel="noopener noreferrer">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="ft-bottom">
        <p>Copyright &copy; 2026 Velara Windows &amp; Doors. All rights reserved.</p>
        <p>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{display:"inline-block",verticalAlign:"-1px",marginRight:"4px",opacity:.5}}>
            <path d="M12 1L9.5 8.5L2 6.5L6 12L2 17.5L9.5 15.5L12 23L14.5 15.5L22 17.5L18 12L22 6.5L14.5 8.5Z"/>
          </svg>
          Proudly Made in Canada
        </p>
      </div>
    </footer>
  );
}
