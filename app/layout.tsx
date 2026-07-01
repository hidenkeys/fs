import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fs-tribute.example.com"),
  title: {
    default: "In Loving Memory of Femi Sobande",
    template: "%s | Femi Sobande"
  },
  description:
    "A peaceful digital memorial celebrating the life, kindness, wisdom, strength, and love of Femi Sobande.",
  openGraph: {
    title: "In Loving Memory of Femi Sobande",
    description:
      "A peaceful digital memorial where family and friends can share tributes, memories, candles, flowers, and stories.",
    images: [{ url: "/images/femi-sobande-hero.png", width: 1200, height: 630 }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "In Loving Memory of Femi Sobande",
    description: "A timeless tribute to Femi Sobande.",
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
