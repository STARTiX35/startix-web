import { test, expect, type Page, type Locator } from '@playwright/test';

// イベント説明文の折り畳み（3行 + 「もっと見る」）の E2E。
//
// 実データの長さに依存する。開催予定イベントが無い時期や、CMS スタブで本文が
// 空になる CI 環境では対象が存在しないため、その場合は検証をスキップする
// （E2E ジョブ自体が MicroCMS secrets の opt-in 時のみ動く構成）。

/**
 * 「もっと見る」ボタンの出現を待つ。見つからなければ null。
 *
 * ボタンはマウント後に本文の溢れを実測してから描画される。goto 直後は
 * hydration が終わっておらず必ず存在しないため、count() や isVisible() の
 * 即時判定を使うと「対象が無い」と誤判定してスキップや失敗になる。
 * 明示的に出現を待ってから判定する。
 */
async function waitForToggle(page: Page): Promise<Locator | null> {
  const toggle = page.getByRole('button', { name: 'もっと見る' }).first();
  try {
    await toggle.waitFor({ state: 'visible', timeout: 5000 });
    return toggle;
  } catch {
    return null;
  }
}

/**
 * ボタンが指している本文要素。
 *
 * React の useId が生成する ID はコロンを含む（`:r0:` など）ため、`#id` 形式の
 * セレクタでは解釈できない。CSS.escape はブラウザ側のグローバルで、Node で動く
 * テストランナーには存在しないので使えない。属性セレクタで引用すれば両方回避できる。
 */
function bodyOf(page: Page, ariaControls: string): Locator {
  return page.locator(`[id="${ariaControls.replace(/["\\]/g, '\\$&')}"]`);
}

test.describe('イベント説明文の折り畳み', () => {
  test('長い説明文は3行に折り畳まれ、もっと見るで全文が開く', async ({ page }) => {
    await page.goto('/event');

    const toggle = await waitForToggle(page);
    test.skip(toggle === null, '折り畳み対象の長い説明文が無い（開催予定イベントなし）');
    if (!toggle) return;

    const body = bodyOf(page, (await toggle.getAttribute('aria-controls')) ?? '');

    // 折り畳み中は全文の高さが表示高さを超えている（＝溢れている）
    const clampedHeight = await body.evaluate((el) => el.clientHeight);
    const fullHeight = await body.evaluate((el) => el.scrollHeight);
    expect(fullHeight).toBeGreaterThan(clampedHeight);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();

    const closeButton = page.getByRole('button', { name: '閉じる' }).first();
    await expect(closeButton).toBeVisible();
    await expect(closeButton).toHaveAttribute('aria-expanded', 'true');
    // 展開後は表示高さが伸びている
    expect(await body.evaluate((el) => el.clientHeight)).toBeGreaterThan(clampedHeight);
  });

  test('閉じるを押すと元の3行に戻る', async ({ page }) => {
    await page.goto('/event');

    const toggle = await waitForToggle(page);
    test.skip(toggle === null, '折り畳み対象の長い説明文が無い（開催予定イベントなし）');
    if (!toggle) return;

    const body = bodyOf(page, (await toggle.getAttribute('aria-controls')) ?? '');
    const clampedHeight = await body.evaluate((el) => el.clientHeight);

    await toggle.click();
    const closeButton = page.getByRole('button', { name: '閉じる' }).first();
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await expect(page.getByRole('button', { name: 'もっと見る' }).first()).toBeVisible();
    expect(await body.evaluate((el) => el.clientHeight)).toBe(clampedHeight);
  });

  test('過去イベントのカードは3行で切られる', async ({ page }) => {
    await page.goto('/event');

    // 過去カードの説明文は line-clamp-3 固定（カード全体が <Link> のためトグルは置かない）。
    // サーバー描画なので hydration を待つ必要はない。
    const clamped = page.locator('p.line-clamp-3');
    const count = await clamped.count();
    test.skip(count === 0, '過去イベントが無い（CMS スタブ環境）');

    const lineCounts = await clamped.evaluateAll((nodes) =>
      nodes.map((el) => {
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
        return Math.round(el.clientHeight / lineHeight);
      }),
    );
    for (const lines of lineCounts) {
      expect(lines).toBeLessThanOrEqual(3);
    }
  });
});
