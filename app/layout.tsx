import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";
import "./globals.css";
import "./order.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "ElectricalsNG — Power for what’s next.", template: "%s | ElectricalsNG" },
  description: site.description,
  openGraph: { siteName: site.name, title: "ElectricalsNG — Power for what’s next.", description: site.description, type: "website", locale: "en_NG" },
  twitter: { card: "summary", title: site.name, description: site.description },
  other: { siteName: site.name, siteDescription: site.description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-NG"><body id="top" className="antialiased"><a href="#main" className="skip-link">Skip to content</a><Header /><main id="main">{children}</main><Footer /></body></html>;
}
