// app/layout.tsx
import React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

// 日本語フォントの設定（Noto Sans JP）
const notoSansJP = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://startix-tsukuba.net"),
  title: "STARTiX - 筑波大学発インカレ起業サークル",
  description:
    "STARTiXは、筑波大学の学生が中心となって活動する起業サークルです。「本気で夢を語り合える場所を作る」をミッションに、起業を志す大学生が集まり、アイデアを形にしています。",
  verification: {
    google: "Agz0QsTpbFd7g_rTVzNb_-1d1zaq40uWSAeaPgVTe6g",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        <link rel="preconnect" href="https://images.microcms-assets.io" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
      </head>
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
