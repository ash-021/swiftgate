import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SwiftGate — Zero-Download Hospitality OS",
  description: "SwiftGate is a zero-app hospitality platform that automates biometric guest check-in and regulatory compliance for modern hotels.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "SwiftGate",
    description: "SwiftGate is a zero-app hospitality platform that automates biometric guest check-in and regulatory compliance for modern hotels.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "SoftwareApplication"],
    "name": "SwiftGate",
    "applicationCategory": "BusinessApplication",
    "description": "B2B hospitality software for automated guest check-in, biometric KYC, and Form C compliance.",
    "url": "https://www.swiftgate.in"
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
