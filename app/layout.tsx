// app/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'STARTiX - 筑波大学起業サークル',
  description: 'STARTiX - 筑波大学の起業サークル。未来の起業家を、今ここから。',
  verification: {
    google: 'Agz0QsTpbFd7g_rTVzNb_-1d1zaq40uWSAeaPgVTe6g',
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
        {children}
      </body>
    </html>
  );
}
