import test from "node:test";
import assert from "node:assert/strict";
import {
  toJstDateKey,
  isUpcomingEvent,
  splitEventsBySchedule,
} from "../app/lib/eventSchedule.js";

// microCMS の日付は ISO 文字列で届く。UTC のまま日付を切り出すと
// 日本時間の早朝〜午前9時前に「まだ前日」と判定され、開催当日のイベントが
// 過去側へ落ちる。判定は必ず Asia/Tokyo のカレンダー日で行う。
test("toJstDateKey は Asia/Tokyo のカレンダー日を返す", () => {
  // UTC で 7/25 15:00 は JST で 7/26 00:00
  assert.equal(toJstDateKey("2026-07-25T15:00:00.000Z"), "2026-07-26");
  // UTC で 7/26 14:59 は JST で 7/26 23:59（まだ同日）
  assert.equal(toJstDateKey("2026-07-26T14:59:00.000Z"), "2026-07-26");
});

test("toJstDateKey は解釈できない値に null を返す", () => {
  assert.equal(toJstDateKey(undefined), null);
  assert.equal(toJstDateKey(""), null);
  assert.equal(toJstDateKey("あした"), null);
});

test("開催日が今日ならまだ開催予定として扱う", () => {
  const now = new Date("2026-07-26T01:00:00.000Z"); // JST 7/26 10:00
  assert.equal(isUpcomingEvent({ date: "2026-07-26T00:00:00.000Z" }, now), true);
});

test("開催日が昨日以前なら過去イベントとして扱う", () => {
  const now = new Date("2026-08-19T01:00:00.000Z"); // JST 8/19 10:00
  assert.equal(isUpcomingEvent({ date: "2026-07-26T00:00:00.000Z" }, now), false);
});

// 日付未入力は CMS の運用ミス。過去側に埋めると誰も気づかないので、
// 開催予定側に出して編集者の目に触れさせる。
test("日付が未入力のイベントは開催予定側に残す", () => {
  const now = new Date("2026-08-19T01:00:00.000Z");
  assert.equal(isUpcomingEvent({ date: "" }, now), true);
  assert.equal(isUpcomingEvent({}, now), true);
});

test("splitEventsBySchedule は開催予定を昇順、過去を降順で返す", () => {
  const now = new Date("2026-08-19T01:00:00.000Z"); // JST 8/19
  const events = [
    { id: "past-old", date: "2026-05-10T00:00:00.000Z" },
    { id: "next-late", date: "2026-09-30T00:00:00.000Z" },
    { id: "past-recent", date: "2026-07-26T00:00:00.000Z" },
    { id: "next-soon", date: "2026-08-19T00:00:00.000Z" },
  ];

  const { upcoming, past } = splitEventsBySchedule(events, now);

  assert.deepEqual(
    upcoming.map((e) => e.id),
    ["next-soon", "next-late"],
  );
  assert.deepEqual(
    past.map((e) => e.id),
    ["past-recent", "past-old"],
  );
});

test("splitEventsBySchedule は元の配列を破壊しない", () => {
  const now = new Date("2026-08-19T01:00:00.000Z");
  const events = [
    { id: "b", date: "2026-09-30T00:00:00.000Z" },
    { id: "a", date: "2026-08-20T00:00:00.000Z" },
  ];
  splitEventsBySchedule(events, now);
  assert.deepEqual(events.map((e) => e.id), ["b", "a"]);
});
