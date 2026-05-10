import { defineConfig, devices } from '@playwright/test';

// E2E テスト設定。
// - ローカル: 既存の dev サーバー (npm run dev) を再利用。
// - CI: 本番ビルドを起動して、本番と同じ CSP / minify 環境でテストする。
//   本番では `unsafe-eval` が CSP から外れるなど、dev 限定の緩和が消えるため、
//   セキュリティヘッダのリグレッションは本番ビルドに対して取らないと意味がない。
//
// MICROCMS_* 環境変数は CI ではテストスタブを与える。実 API には接続しないが、
// app/lib/microcms.ts の env チェックを通過させ、ページの shell が描画できる
// 程度の値を渡す。実 API を叩きたい場合はワークフロー側で secrets を注入する。
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: isCI ? 'npm run build && npm run start' : 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
    // 環境変数は意図的に上書きしない。ローカル実行時は .env.local が next dev/start に
    // よって読み込まれる。CI 実行時は GitHub Actions の env: ブロックで MICROCMS_* を
    // 上位プロセスに注入してあるため、子プロセスにも継承される。
  },
});
