// イベントが「開催予定」か「過去」かを開催日から判定するヘルパー。
//
// 以前は microCMS の category フィールド（"upcoming" が含まれるか）で振り分けていたため、
// 編集者が手で切り替えるまで終了済みイベントが「次回のイベント」に居座り続けた。
// 実害: 2026-07-26 開催の夏企画 #02 が 8/19 時点でもトップと /event の「次回」に出ていた。
// 判定を開催日ベースにして、切り替え忘れという運用事故そのものを無くす。
//
// テスト: tests/event-schedule.test.mjs（CI の lint ジョブで実行）
// .js + JSDoc で書いているのは、CI の Node 20 が TS を直接実行できず、
// テストからそのまま import できる形にしておく必要があるため。

const JST_TIME_ZONE = "Asia/Tokyo";

// "YYYY-MM-DD" 形式は文字列比較がそのまま日付の大小比較になる（辞書順＝時系列順）
const jstDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: JST_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * ISO 文字列や Date を日本時間のカレンダー日 "YYYY-MM-DD" に変換する。
 * UTC のまま日付を切り出すと、JST の 0:00-9:00 が前日扱いになり
 * 開催当日のイベントが過去側へ落ちる。
 *
 * @param {string | Date | undefined | null} value
 * @returns {string | null} 解釈できない値なら null
 */
export function toJstDateKey(value) {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return jstDateFormatter.format(parsed);
}

/**
 * 開催予定なら true。開催日当日はまだ開催予定として扱う。
 *
 * 日付が未入力・不正なイベントは true（開催予定側）にする。
 * 過去側へ埋めると CMS の入力漏れに誰も気づかないため、
 * 目に触れる場所に出して編集者に直させる。
 *
 * @param {{ date?: string }} event
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isUpcomingEvent(event, now = new Date()) {
  const eventDay = toJstDateKey(event?.date);
  if (eventDay === null) return true;
  const today = toJstDateKey(now);
  if (today === null) return true;
  return eventDay >= today;
}

/**
 * イベント配列を開催予定（開催日の昇順＝直近が先頭）と
 * 過去（降順＝最近開催したものが先頭）に分ける。引数の配列は変更しない。
 *
 * @template {{ date?: string }} T
 * @param {readonly T[]} events
 * @param {Date} [now]
 * @returns {{ upcoming: T[], past: T[] }}
 */
export function splitEventsBySchedule(events, now = new Date()) {
  const upcoming = [];
  const past = [];

  for (const event of events ?? []) {
    if (isUpcomingEvent(event, now)) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  }

  // 日付未入力（キーが null）は末尾へ寄せ、日付のあるイベントの並びを乱さない
  const byDateAsc = (a, b) =>
    (toJstDateKey(a.date) ?? "9999-12-31").localeCompare(
      toJstDateKey(b.date) ?? "9999-12-31",
    );

  upcoming.sort(byDateAsc);
  past.sort((a, b) => byDateAsc(b, a));

  return { upcoming, past };
}
