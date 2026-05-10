/** @type {import('next').NextConfig} */
//
// Next.js 設定。
// - swcMinify: Next 15 でデフォルト true になり、明示指定は不要 (書くと警告)
// - images.domains は非推奨、remotePatterns に置き換え
// - headers(): セキュリティヘッダを全ルートに付与
//

// CSP の運用フラグ。すべて任意の環境変数で切り替える。
// CSP_REPORT_ONLY=1: 違反をブロックせず report-uri に POST するだけ。
//                   ロールアウト初期や CSP の変更時に使う。
// CSP_REPORT_URI=https://...: CSP 違反レポートの送信先。Sentry などの security endpoint。
//                            未設定なら report-uri を出さない。
// HSTS_PRELOAD=1: HSTS の preload ディレクティブを付ける。
//                hstspreload.org への登録手続き完了後にだけ有効化すること。
const cspReportOnly = process.env.CSP_REPORT_ONLY === '1';
const cspReportUri = process.env.CSP_REPORT_URI?.trim();
const hstsPreload = process.env.HSTS_PRELOAD === '1';

// CSP 値の組み立て。
// 注意: 全ページが SSG のためリクエストごとに nonce を発行することができず、
// `script-src 'unsafe-inline'` を許容している。これは事実上 XSS に対する第一線防御を
// 諦めた状態であり、CSP の主目的はクリックジャッキング (frame-ancestors)、
// データ流出経路の制限 (connect-src)、混在コンテンツの防止 (upgrade-insecure-requests)。
// XSS 対策は React の自動エスケープと dangerouslySetInnerHTML の不使用に依存している。
const cspDirectives = [
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
];
if (cspReportUri) {
  cspDirectives.push(`report-uri ${cspReportUri}`);
}
const cspValue = cspDirectives.join('; ');
const cspHeaderKey = cspReportOnly
  ? 'Content-Security-Policy-Report-Only'
  : 'Content-Security-Policy';

const hstsValue = `max-age=63072000; includeSubDomains${hstsPreload ? '; preload' : ''}`;

/** @type {{ key: string; value: string }[]} */
const securityHeaders = [
  // ブラウザに HTTPS のみで接続させる (HSTS)。max-age は 2 年。
  // preload は別ドメイン削除困難なので HSTS_PRELOAD=1 で明示的に opt-in する。
  { key: 'Strict-Transport-Security', value: hstsValue },
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
  { key: cspHeaderKey, value: cspValue },
];

const nextConfig = {
  reactStrictMode: true,
  // X-Powered-By: Next.js を返さない (不要なフィンガープリント情報を出さない)
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
