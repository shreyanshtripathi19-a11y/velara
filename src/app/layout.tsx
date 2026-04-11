import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileDrawer from "@/components/MobileDrawer";
import QuoteModal from "@/components/QuoteModal";
import ScrollToTop from "@/components/ScrollToTop";
import { DrawerProvider } from "@/context/DrawerContext";
import { QuoteModalProvider } from "@/context/QuoteModalContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Velara Windows & Doors | Premium Canadian Manufacturer",
  description:
    "Factory-direct premium windows, doors, and garage doors. Proudly Canadian. 25-year warranty. 4–8 day turnaround.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        />
      </head>
      <body className={inter.variable}>
        <QuoteModalProvider>
          <DrawerProvider>
            <ScrollToTop />
            <Navbar />
            <MobileDrawer />
            <main>{children}</main>
            <Footer />
            <QuoteModal />
          </DrawerProvider>
        </QuoteModalProvider>
      </body>
    </html>
  );
}
