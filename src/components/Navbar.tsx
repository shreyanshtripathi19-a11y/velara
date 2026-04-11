"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDrawer } from "@/context/DrawerContext";

export default function Navbar() {
  const pathname = usePathname();
  const { toggle, isOpen } = useDrawer();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAct = (href: string) => {
    if (href === "/" && pathname === "/") return "act";
    if (href !== "/" && pathname.startsWith(href)) return "act";
    return "";
  };

  return (
    <nav id="nav" className={scrolled ? "nav-scrolled" : ""}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <img src="/assets/velara-logo.png" alt="Velara" />
        </Link>

        <ul className="nav-center">
          <li className={isAct("/")}><Link href="/">Home</Link></li>
          <li className={`nav-dd-wrap ${isAct("/windows") || isAct("/doors") || isAct("/garage")}`}>
            <span>Services ▾</span>
            <div className="nav-dd">
              <Link href="/windows">Windows</Link>
              <Link href="/doors">Doors</Link>
              <Link href="/garage">Garage Doors</Link>
            </div>
          </li>
          <li className={isAct("/builders")}><Link href="/builders">Builders</Link></li>
          <li className={isAct("/why-us")}><Link href="/why-us">Why Us</Link></li>
          <li className={isAct("/gallery")}><Link href="/gallery">Gallery</Link></li>
          <li className={isAct("/contact")}><Link href="/contact">Contact</Link></li>
        </ul>

        <div className="nav-right">
          <a className="nav-phone" href="tel:4165007610">416-500-7610</a>
          <Link href="/contact" className="nav-cta">Free Estimate</Link>
          <div
            className={`nav-hamburger${isOpen ? " open" : ""}`}
            onClick={toggle}
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </nav>
  );
}
