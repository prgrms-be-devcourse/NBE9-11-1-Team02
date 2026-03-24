import type { Metadata } from "next";
import { Playfair_Display, DM_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Grids & Circles",
  description: "Specialty Coffee",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
          lang="ko"
          className={`${playfair.variable} ${dmMono.variable} h-full`}>
      <body className="min-h-full flex flex-col" style={{ background: "var(--cream)", color: "var(--ink)" }}>

      {/* Header */}
      <header style={{ background: "var(--ink)", height: "60px" }}>
        <div className="container mx-auto flex justify-between items-center h-full px-8">
          <Link href="/" style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "28px",
            fontWeight: "900",
            color: "var(--cream)",
          }}>
            Grids &amp; Circles
          </Link>
          <nav className="flex gap-6">
            <Link href="/admin/products" style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(245,234,214,0.6)",
            }}>관리자</Link>
            <Link href="/orders" style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(245,234,214,0.6)",
            }}>주문 조회</Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto p-8">
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: "var(--ink)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container mx-auto px-8 py-4 flex justify-between items-center">
          <p style={{ fontFamily: "var(--font-playfair), serif", color: "var(--cream)", fontSize: "14px" }}>
            © 2026 Grids &amp; Circles
          </p>
          <div className="flex gap-4">
            <a href="#" style={{ color: "rgba(245,234,214,0.5)", fontSize: "11px", letterSpacing: "0.08em" }}>페이스북</a>
            <a href="#" style={{ color: "rgba(245,234,214,0.5)", fontSize: "11px", letterSpacing: "0.08em" }}>인스타그램</a>
          </div>
        </div>
      </footer>

      </body>
      </html>
  );
}