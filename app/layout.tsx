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
