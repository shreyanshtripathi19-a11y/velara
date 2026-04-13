import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import { DrawerProvider } from "@/context/DrawerContext";
import { QuoteModalProvider } from "@/context/QuoteModalContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Velara Windows & Doors | Premium Canadian Manufacturer",
  description:
    "Factory-direct premium windows, doors, and garage doors. Proudly Canadian. 25-year warranty. 4–8 day turnaround.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className={inter.variable}>
        <QuoteModalProvider>
          <DrawerProvider>
            <SiteShell>{children}</SiteShell>
          </DrawerProvider>
        </QuoteModalProvider>
      </body>
    </html>
  );
}
