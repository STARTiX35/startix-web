// microCMS Webhook からの通知を受けて On-Demand ISR を発火させる。
// microCMS 管理画面 > サービス設定 > API > Webhook で
// 「Vercel」または「カスタム通知」として下記 URL を登録し、
// シークレットを MICROCMS_WEBHOOK_SECRET と一致させる。
//   URL: https://<your-domain>/api/revalidate
//
// 署名検証は HMAC-SHA256 で行う。ヘッダ名は `X-MICROCMS-Signature`。
// 参考: https://document.microcms.io/manual/webhook-setting
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

// Webhook で更新通知が来た endpoint と、対応する再生成パスの対応表。
// 新しい endpoint を増やしたらここに足すだけで反映される。
const ENDPOINT_TO_PATHS: Record<string, string[]> = {
  events: ['/', '/event'],
  hero: ['/'],
};

function timingSafeEqualHex(a: string, b: string): boolean {
  // タイミング攻撃を避けるため固定時間で比較する。
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  const secret = process.env.MICROCMS_WEBHOOK_SECRET?.trim();
  if (!secret) {
    // 設定漏れは早期に潰す。
    return NextResponse.json(
      { error: 'MICROCMS_WEBHOOK_SECRET is not set' },
      { status: 500 },
    );
  }

  const signature = req.headers.get('x-microcms-signature');
  if (!signature) {
    return NextResponse.json({ error: 'missing signature' }, { status: 401 });
  }

  // 署名検証より前に body サイズで早期遮断する。
  // 偽署名 + 巨大 body で HMAC 計算リソースを食わせる DoS を防ぐ目的。
  // microCMS の Webhook payload は通常数 KB 程度なので 64KB で十分。
  const MAX_BODY_BYTES = 64 * 1024;
  const contentLength = Number(req.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'payload too large' }, { status: 413 });
  }

  // 署名は body の生バイト列に対する HMAC なので text() で受ける。
  const rawBody = await req.text();
  // Content-Length ヘッダが欠落 / 偽装されているケースに備えて再チェック。
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'payload too large' }, { status: 413 });
  }
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  if (!timingSafeEqualHex(signature, expected)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  let payload: { api?: string; type?: string; id?: string } = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const endpoint = payload.api;
  const paths = endpoint ? ENDPOINT_TO_PATHS[endpoint] : undefined;

  if (!paths) {
    // 未登録 endpoint からの通知は 200 で返しつつ何もしない (Webhook を切らないため)。
    return NextResponse.json({ revalidated: false, reason: 'unknown endpoint', endpoint });
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: true,
    endpoint,
    paths,
    now: Date.now(),
  });
}
