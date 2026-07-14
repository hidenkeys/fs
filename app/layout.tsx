import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fs-seven-liard.vercel.app"),
  title: {
    default: "In Loving Memory of Olufemi Sobande",
    template: "%s | Olufemi Sobande"
  },
  description:
    "A peaceful digital memorial celebrating the life, kindness, wisdom, strength, and love of Olufemi Sobande.",
  openGraph: {
    title: "In Loving Memory of Olufemi Sobande",
    description:
      "A peaceful digital memorial where family and friends can share tributes, memories, candles, flowers, and stories.",
    images: [{ url: "/images/femi-sobande-hero.png", width: 1200, height: 630 }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "In Loving Memory of Olufemi Sobande",
    description: "A timeless tribute to Olufemi Sobande.",
    images: ["/images/femi-sobande-hero.png"]
  },
  icons: {
    icon: "/icons/favicon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#F5EFE4"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
