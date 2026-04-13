"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDrawer } from "@/context/DrawerContext";

export default function MobileDrawer() {
  const { isOpen, close } = useDrawer();
  const pathname = usePathname();

  const linkStyle = (href: string) => {
    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return isActive ? { color: "var(--accent)", fontWeight: 600 } : {};
  };

  return (
    <div id="nav-drawer" className={isOpen ? "open" : ""}>
      <Link href="/" className="drawer-item" onClick={close} style={linkStyle("/")}>Home</Link>
      <div className="drawer-item" style={{cursor:"default",color:"rgba(255,255,255,.35)",fontSize:".7rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",paddingBottom:"4px",borderBottom:"none"}}>Services</div>
      <div className="drawer-sub">
        <Link href="/windows" onClick={close} style={linkStyle("/windows")}>Windows</Link>
        <Link href="/doors" onClick={close} style={linkStyle("/doors")}>Doors</Link>
        <Link href="/garage" onClick={close} style={linkStyle("/garage")}>Garage Doors</Link>
      </div>
      <Link href="/builders" className="drawer-item" onClick={close} style={linkStyle("/builders")}>Builders</Link>
      <Link href="/emergency" className="drawer-item" onClick={close} style={linkStyle("/emergency")}>24/7 Emergency</Link>
      <Link href="/why-us" className="drawer-item" onClick={close} style={linkStyle("/why-us")}>Why Us</Link>
      <Link href="/gallery" className="drawer-item" onClick={close} style={linkStyle("/gallery")}>Gallery</Link>
      <Link href="/contact" className="drawer-item" onClick={close} style={linkStyle("/contact")}>Contact</Link>
      <Link href="/contact" className="drawer-cta" onClick={close}>Get a Free Estimate</Link>
      <div className="drawer-phone"><a href="tel:4165007610" style={{color:"var(--accent)",fontWeight:500}}>416-500-7610</a></div>
    </div>
  );
}
