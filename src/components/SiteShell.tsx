"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileDrawer from "@/components/MobileDrawer";
import QuoteModal from "@/components/QuoteModal";
import ScrollToTop from "@/components/ScrollToTop";
import NotificationBar from "@/components/NotificationBar";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollToTop />
      <NotificationBar />
      <Navbar />
      <MobileDrawer />
      <main>{children}</main>
      <Footer />
      <QuoteModal />
    </>
  );
}
