// MicroCMS クライアント
// このモジュールはサーバーコンポーネント専用。
// API キーは NEXT_PUBLIC_ を付けないことでブラウザバンドルに埋め込まれない。
// 後方互換のため旧 NEXT_PUBLIC_* 変数もフォールバックとして読むが、本番では新変数のみ使うこと。
import 'server-only';
import { createClient } from 'microcms-js-sdk';

const serviceDomain =
  process.env.MICROCMS_SERVICE_DOMAIN ?? process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY ?? process.env.NEXT_PUBLIC_MICROCMS_API_KEY;

if (!serviceDomain) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}
if (!apiKey) {
  throw new Error('MICROCMS_API_KEY is required');
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
  imageUrl: {
    url: string;
    height: number;
    width: number;
  };
  registrationUrl: string;
  detailsUrl: string;
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