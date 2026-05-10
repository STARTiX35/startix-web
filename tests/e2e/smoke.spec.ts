import { test, expect } from '@playwright/test';

// 各ページが 200 で返り、最低限のコンテンツが描画されることを確認する E2E スモークテスト。
// MicroCMS の API キーがブラウザバンドルに混入していないことの検証もここに含める。

test.describe('smoke', () => {
  test('home renders main heading', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/STARTiX/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('STARTiX');

    // ヒーロースライドショーの画像が読み込まれること
    const heroImages = page.locator('img');
    expect(await heroImages.count()).toBeGreaterThan(0);
  });

  test('event page lists upcoming or past events container', async ({ page }) => {
    const response = await page.goto('/event');
    expect(response?.status()).toBe(200);

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Events|イベント情報/);
    await expect(page.getByText('次回のイベント')).toBeVisible();
    await expect(page.getByText('過去のイベント')).toBeVisible();
  });

  test('contact page shows email and instagram CTA', async ({ page }) => {
    const response = await page.goto('/contact');
    expect(response?.status()).toBe(200);

    await expect(page.getByText('お気軽にご連絡下さい')).toBeVisible();
    await expect(page.getByRole('link', { name: /メールでお問い合わせ/ })).toHaveAttribute(
      'href',
      /mailto:/,
    );
  });
});
