// CMS（microCMS）由来の URL を <a href> に渡す前の検証ヘルパー。
// CMS の編集アカウントが侵害されると `javascript:alert(1)` のような URL を
// 保存でき、React は警告を出すだけでそのまま href に出力してしまう（stored XSS）。
// https 以外の scheme は一律拒否し、呼び出し側は undefined ならリンクを描画しない。
export function safeHttpsUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).protocol === "https:" ? url : undefined;
  } catch {
    // URL として解釈できない文字列（相対パス・空白のみ等）も拒否する
    return undefined;
  }
}
