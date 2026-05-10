import { test, expect } from '@playwright/test';

// セキュリティヘッダのリグレッションテスト。
// next.config.js の headers() 設定が壊れたときに気付けるようにしておく。

test.describe('security headers', () => {
  test('home returns expected security headers', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);

    const headers = response.headers();

    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
    expect(headers['permissions-policy']).toContain('microphone=()');
    expect(headers['permissions-policy']).toContain('geolocation=()');

    expect(headers['strict-transport-security']).toMatch(/max-age=\d+/);
    expect(headers['strict-transport-security']).toContain('includeSubDomains');

    const csp = headers['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");

    // フィンガープリントを返さない
    expect(headers['x-powered-by']).toBeUndefined();
  });

  test('MicroCMS API key is not exposed in client HTML', async ({ request }) => {
    // NEXT_PUBLIC_* を外したので、API キーがレスポンス HTML に含まれていないことを確認。
    // テスト用ダミーキーを設定している場合のみ意味があるが、最低限文字列「microcms.io」風のキー文字列が
    // HTML 中に直接現れないことをチェックする。
    const response = await request.get('/');
    const body = await response.text();

    // MicroCMS の API キーは英数字 + ハイフンの 30 文字以上のランダム文字列。
    // 本番キーが何であれ、`apiKey` プロパティ名が直接 JSON に出てはいけない。
    expect(body).not.toMatch(/"apiKey"\s*:\s*"[^"]+"/);
  });
});
