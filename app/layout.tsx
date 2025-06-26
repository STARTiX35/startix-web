// app/layout.tsx
import React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "STARTiX - 筑波大学発インカレ起業サークル",
  description:
    "STARTiXは、筑波大学を中心に活動するインカレの学生起業家サークルです。起業に興味がある仲間と共に、アイデアを形にし、社会に新しい価値を提供することを目指しています。",
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
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
