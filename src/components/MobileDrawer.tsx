"use client";
import Link from "next/link";
import { useDrawer } from "@/context/DrawerContext";

export default function MobileDrawer() {
  const { isOpen, close } = useDrawer();

  return (
    <div id="nav-drawer" className={isOpen ? "open" : ""}>
      <Link href="/" className="drawer-item" onClick={close}>Home</Link>
      <div className="drawer-item" style={{cursor:"default",color:"rgba(255,255,255,.35)",fontSize:".7rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",paddingBottom:"4px",borderBottom:"none"}}>Services</div>
      <div className="drawer-sub">
        <Link href="/windows" onClick={close}>Windows</Link>
        <Link href="/doors" onClick={close}>Doors</Link>
        <Link href="/garage" onClick={close}>Garage Doors</Link>
      </div>
      <Link href="/builders" className="drawer-item" onClick={close}>Builders</Link>
      <Link href="/why-us" className="drawer-item" onClick={close}>Why Us</Link>
      <Link href="/gallery" className="drawer-item" onClick={close}>Gallery</Link>
      <Link href="/contact" className="drawer-item" onClick={close}>Contact</Link>
      <Link href="/contact" className="drawer-cta" onClick={close}>Get a Free Estimate</Link>
      <div className="drawer-phone"><a href="tel:4165007610" style={{color:"var(--accent)",fontWeight:500}}>416-500-7610</a></div>
    </div>
  );
}
