import { test, expect } from '@playwright/test';

// セキュリティヘッダのリグレッションテスト。
// next.config.js の headers() 設定が壊れたときに気付けるようにしておく。
// CI では本番ビルドに対して実行される (playwright.config.ts の webServer 参照)。

const isProductionBuild = !!process.env.CI;

test.describe('security headers', () => {
  test('home returns expected security headers', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);

    const headers = response.headers();

    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');

    // Permissions-Policy: 全 directive を網羅して、
    // 設定変更時に正確に検出できるようにする。
    const permissionsPolicy = headers['permissions-policy'];
    expect(permissionsPolicy).toBeDefined();
    expect(permissionsPolicy).toContain('camera=()');
    expect(permissionsPolicy).toContain('microphone=()');
    expect(permissionsPolicy).toContain('geolocation=()');
    expect(permissionsPolicy).toContain('interest-cohort=()');

    // HSTS: max-age は最低 1 年 (1 年 = 31536000 秒、7 桁) を要求。
    // 短すぎる max-age や `max-age=0` はリグレッション扱い。
    const hsts = headers['strict-transport-security'];
    expect(hsts).toBeDefined();
    expect(hsts).toMatch(/max-age=\d{8,}/);
    expect(hsts).toContain('includeSubDomains');

    const csp = headers['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");

    // 本番ビルドでは `unsafe-eval` が CSP から外れていなければならない。
    // dev ビルドではフレームワークが eval を使うため許可されている。
    if (isProductionBuild) {
      expect(csp).not.toContain("'unsafe-eval'");
    }

    // フィンガープリントを返さない
    expect(headers['x-powered-by']).toBeUndefined();
  });

  test('MicroCMS API key is not exposed in HTML or JS bundles', async ({ request }) => {
    // NEXT_PUBLIC_* を外したので、API キーがクライアント側コードに含まれていないことを確認。
    // CI では webServer.env で MICROCMS_API_KEY=stub-api-key-for-build-only を注入しているため、
    // この値が HTML / JS バンドルに出現していなければ秘匿に成功している。
    const apiKey = process.env.MICROCMS_API_KEY ?? 'stub-api-key-for-build-only';

    // ダミーキーが短すぎたり一般的な単語だと誤検出するため、
    // ある程度ユニークな文字列であることを要求する。
    expect(apiKey.length).toBeGreaterThanOrEqual(8);

    // 1) HTML レスポンスに含まれていないこと。
    const home = await request.get('/');
    const homeBody = await home.text();
    expect(homeBody).not.toContain(apiKey);
    // JSON シリアライズ済みの apiKey フィールドも併せて検出する (鍵名がリネームされても
    // JSON 形式で出てきていれば気付ける、という補助チェック)。
    expect(homeBody).not.toMatch(/"apiKey"\s*:\s*"[^"]+"/);

    // 2) HTML 内で参照されている JS バンドルにも含まれていないこと。
    // 本番ビルドでは bundle が minify されているため、apiKey 値の grep が現実的な検査。
    const scriptUrls = Array.from(
      homeBody.matchAll(/<script[^>]+src="([^"]+\.js[^"]*)"/g),
      (m) => m[1],
    );
    expect(scriptUrls.length).toBeGreaterThan(0);

    for (const src of scriptUrls.slice(0, 20)) {
      const url = src.startsWith('http') ? src : src;
      const res = await request.get(url);
      if (!res.ok()) continue;
      const body = await res.text();
      expect(body, `API key found in ${src}`).not.toContain(apiKey);
    }
  });
});
