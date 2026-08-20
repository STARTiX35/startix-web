import { test, expect } from '@playwright/test';

// イベント説明文の折り畳み（3行 + 「もっと見る」）の E2E。
//
// 実データの長さに依存するテストなので、CMS スタブで本文が空になる CI 環境では
// 対象が見つからない。その場合は検証をスキップし、失敗にはしない
// （E2E ジョブ自体が MicroCMS secrets の opt-in 時のみ動く構成のため）。

test.describe('イベント説明文の折り畳み', () => {
  test('長い説明文は3行に折り畳まれ、もっと見るで全文が開く', async ({ page }) => {
    await page.goto('/event');

    const toggle = page.getByRole('button', { name: 'もっと見る' }).first();
    if ((await toggle.count()) === 0) {
      test.skip(true, '折り畳み対象の長い説明文が無い（CMS スタブ環境）');
    }

    // 折り畳み中は本文が clientHeight を超えている（＝溢れている）
    const body = page.locator(`#${CSS.escape(await toggle.getAttribute('aria-controls') ?? '')}`);
    const clampedHeight = await body.evaluate((el) => el.clientHeight);
    const fullHeight = await body.evaluate((el) => el.scrollHeight);
    expect(fullHeight).toBeGreaterThan(clampedHeight);

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();

    // 展開後は全文が見えている（clientHeight が scrollHeight に追いついた）
    await expect(page.getByRole('button', { name: '閉じる' }).first()).toBeVisible();
    const expandedHeight = await body.evaluate((el) => el.clientHeight);
    expect(expandedHeight).toBeGreaterThan(clampedHeight);

    await expect(page.getByRole('button', { name: '閉じる' }).first()).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  test('閉じるを押すと元の3行に戻る', async ({ page }) => {
    await page.goto('/event');

    const toggle = page.getByRole('button', { name: 'もっと見る' }).first();
    if ((await toggle.count()) === 0) {
      test.skip(true, '折り畳み対象の長い説明文が無い（CMS スタブ環境）');
    }

    const body = page.locator(`#${CSS.escape(await toggle.getAttribute('aria-controls') ?? '')}`);
    const clampedHeight = await body.evaluate((el) => el.clientHeight);

    await toggle.click();
    await page.getByRole('button', { name: '閉じる' }).first().click();

    await expect(page.getByRole('button', { name: 'もっと見る' }).first()).toBeVisible();
    expect(await body.evaluate((el) => el.clientHeight)).toBe(clampedHeight);
  });

  test('過去イベントのカードは3行で切られ、高さが揃う', async ({ page }) => {
    await page.goto('/event');

    // 過去カードの説明文は line-clamp-3 固定（カード全体が <Link> のためトグルは置かない）
    const clamped = page.locator('p.line-clamp-3');
    const count = await clamped.count();
    if (count === 0) {
      test.skip(true, '過去イベントが無い（CMS スタブ環境）');
    }

    // どのカードの本文も3行ぶんの高さに収まっている
    const heights = await clamped.evaluateAll((nodes) =>
      nodes.map((el) => {
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
        return Math.round(el.clientHeight / lineHeight);
      }),
    );
    for (const lines of heights) {
      expect(lines).toBeLessThanOrEqual(3);
    }
  });
});
