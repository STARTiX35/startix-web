import { createClient } from 'microcms-js-sdk';

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,  // あなたのMicroCMSのサービスドメイン
  apiKey: process.env.MICROCMS_API_KEY,
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