// MicroCMS クライアント (サーバー専用)。
// API キーは NEXT_PUBLIC_ を付けないことでブラウザバンドルに埋め込まれない。
// NEXT_PUBLIC_ プレフィックス付きの変数が残っていると Next.js のビルド時に
// クライアント JS バンドルへ literal で焼き込まれるため、明示的に拒否する。
import 'server-only';
import { createClient } from 'microcms-js-sdk';

if (process.env.NEXT_PUBLIC_MICROCMS_API_KEY) {
  throw new Error(
    'NEXT_PUBLIC_MICROCMS_API_KEY must be removed. ' +
      'NEXT_PUBLIC_ prefix leaks the key into the client bundle. Use MICROCMS_API_KEY instead.',
  );
}

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN?.trim();
const apiKey = process.env.MICROCMS_API_KEY?.trim();

if (!serviceDomain) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required (server-side env var, no NEXT_PUBLIC_ prefix)');
}
if (!apiKey) {
  throw new Error('MICROCMS_API_KEY is required (server-side env var, no NEXT_PUBLIC_ prefix)');
}

export const client = createClient({
  serviceDomain,
  apiKey,
});

export type Event = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string[];
  eventType: string[];
  // 以下3つは microCMS 側で未入力のまま公開できるフィールドのため optional。
  // required 扱いにすると、編集者が画像や URL を空にした瞬間に
  // ページ全体が 500 になる（実際に起こり得る運用ミス）。
  imageUrl?: {
    url: string;
    height: number;
    width: number;
  };
  registrationUrl?: string;
  detailsUrl?: string;
};

export type HeroImage = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  image: {
    url: string;
    height: number;
    width: number;
  };
};