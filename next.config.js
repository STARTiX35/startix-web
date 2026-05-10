/** @type {import('next').NextConfig} */
//
// Next.js 設定
// - swcMinify: Next 15 でデフォルト true になり、明示指定は不要（書くと警告）
// - images.domains は非推奨、remotePatterns に置き換え
// - env: NEXT_PUBLIC_* はそのまま使うか、サーバー専用は server-side で参照
// - headers(): セキュリティヘッダを全ルートに付与
//
const securityHeaders = [
  // ブラウザに HTTPS のみで接続させる (HSTS)。 max-age は 2 年。
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // MIME sniff を無効化
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // 古いブラウザ向けクリックジャッキング対策。CSP frame-ancestors も併せて設定。
  { key: 'X-Frame-Options', value: 'DENY' },
  // 余計なリファラ情報の漏洩を抑える
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // 不要なブラウザ機能を無効化
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // CSP は静的サイトなので比較的厳しめ。
  // - script: self + Vercel Analytics + Next.js が dev で必要とする 'unsafe-eval' (本番は外す)
  // - style: 'unsafe-inline' は Tailwind / Next.js inline style のため必須
  // - image: self + MicroCMS + data:
  // - connect: self + Vercel Analytics
  // - frame-ancestors: 'none' でクリックジャッキング遮断
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com https://vercel.live`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.microcms-assets.io https://*.microcms-assets.io",
      "font-src 'self' data:",
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  // X-Powered-By: Next.js を返さない（不要なフィンガープリント情報を出さない）
  poweredByHeader: false,
  images: {
    // Next 15 で domains は非推奨。remotePatterns で host だけでなく protocol/path も縛る。
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
