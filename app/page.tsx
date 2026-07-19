import React from "react";
import Image from "next/image";
import HeroSlideshow from "./components/HeroSlideshow";
import { client, Event, HeroImage } from "./lib/microcms";
import { safeHttpsUrl } from "./lib/safeUrl";
import { Metadata } from "next";
import RelativeLink from "./components/RelativeLink";

// サーバーコンポーネントに変更（'use client'を削除）
// On-Demand ISR (microCMS Webhook → /api/revalidate) で即時反映する。
// 下記の数値は Webhook が万一失敗した場合のフォールバックの最大鮮度。
export const revalidate = 86400; // 24時間（秒単位）。通常は webhook 経由で即時更新される

export default async function Home() {
  // MicroCMSから次回のイベントとヒーロー画像を取得する。
  // fetch 失敗でビルド(SSG)ごと落とさないよう try/catch で受け、空状態にフォールバックする。
  // 実害: 2026-06-30以降、ビルド時の microCMS fetch が "Network Error" になると
  // Vercel デプロイ全体が失敗していた。ISR (webhook + revalidate) があるので、
  // 一時的に空でも CMS 復旧後の再生成で内容は戻る。
  // 型引数を明示しないと contents が any になり、
  // フィールド欠落時の null ガード漏れをコンパイラが検出できない
  let nextEvent: Event | undefined;
  let heroImageList: HeroImage[] = [];
  try {
    const response = await client.getList<Event>({
      endpoint: "events",
      queries: { filters: "category[contains]upcoming", limit: 1 },
    });
    nextEvent = response.contents[0];
  } catch (error) {
    console.error("microCMS events fetch failed (home) — 空状態で描画継続:", error);
  }
  try {
    const heroImages = await client.getList<HeroImage>({
      endpoint: "hero",
    });
    heroImageList = heroImages.contents;
  } catch (error) {
    console.error("microCMS hero fetch failed — スライドショーなしで描画継続:", error);
  }

  // CMS由来の外部URLは https scheme 検証を通ったものだけリンクとして描画する
  const registrationUrl = safeHttpsUrl(nextEvent?.registrationUrl);
  const detailsUrl = safeHttpsUrl(nextEvent?.detailsUrl);

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー分の余白は Header コンポーネント側のスペーサーで確保済み。
          ここで pt を足すと二重になり、ヘッダー下に不自然な空白ができる（2026-07-17 修正） */}
      <div>
        {/* ヒーローセクション */}
        <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 min-h-[600px] overflow-hidden">
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative order-2 md:order-1">
                <div className="absolute -left-4 -top-4 w-24 h-24 bg-purple-100 rounded-full opacity-50"></div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
                {/* SEOのための非表示h1タグ */}
                <h1 className="sr-only">
                  STARTiX - 筑波大学の起業サークル
                </h1>
                {/* 従来のh1の見た目をpタグで維持 */}
                <p className="text-3xl md:text-5xl font-bold mb-6 relative text-black">
                  未来の
                  <span className="text-purple-600 relative inline-block">
                    起業家
                  </span>
                  を、
                  <br />
                  今ここから。
                </p>
                <p className="text-black mb-8 text-base md:text-lg relative">
                  STARTiXは筑波大学の起業サークルです。新しいアイデアの創出から実際の起業まで、挑戦する学生をサポートします。一緒に夢を語りませんか？
                </p>
                <RelativeLink
                  href="/event"
                  className="inline-flex items-center px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  次回イベントに参加
                </RelativeLink>
              </div>
              <div className="relative order-1 md:order-2 h-[400px] md:h-[500px]">
                <HeroSlideshow
                  images={heroImageList
                    .map((item) => item.image)
                    .filter((image) => Boolean(image))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 次回のイベント - MicroCMSデータを使用 */}
        <section className="py-20 bg-white relative">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                次回のイベント
                <span className="block text-xl md:text-2xl mt-2 text-gray-600">
                  Next Event
                </span>
              </h2>
              <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
            </div>

            {nextEvent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="order-2 md:order-1 bg-white rounded-3xl shadow-lg p-8 transform transition-transform hover:scale-105 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full opacity-50 -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 -ml-16 -mb-16"></div>
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center text-purple-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {new Date(nextEvent.date).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          weekday: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-purple-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{`${nextEvent.startTime} - ${nextEvent.endTime}`}</span>
                    </div>
                    <div className="flex items-center text-purple-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{nextEvent.location}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mt-6 mb-4">
                      {nextEvent.title}
                    </h3>
                    <p className="text-gray-600 text-base md:text-lg">
                      {nextEvent.description}
                    </p>
                    <div className="flex gap-4 mt-8">
                      {registrationUrl && (
                        <a
                          href={registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                        >
                          参加申し込み
                        </a>
                      )}
                      {detailsUrl && (
                        <a
                          href={detailsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                        >
                          詳細を見る
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2 bg-black rounded-3xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 relative h-48 md:h-auto">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src={nextEvent.imageUrl?.url ?? "/images/events1.PNG"}
                    alt={nextEvent.title}
                    width={600}
                    height={800}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl shadow-lg p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full opacity-50 -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 -ml-16 -mb-16"></div>
                <div className="relative z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-purple-600 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-600 text-lg">
                    現在、開催予定のイベントはありません。
                  </p>
                  <p className="text-gray-600 mt-2">
                    定期的にイベントを開催していますので、またチェックしてください。
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* OUR MISSION */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              {/* SEOのための非表示h2タグ */}
              <h2 className="sr-only">
                STARTiXのミッション：本気で夢を語り合える場所を作る
              </h2>
              {/* 従来のh2の見た目をpタグで維持 */}
              <p className="text-3xl md:text-4xl font-bold mb-4">
                Our Mission
                <span className="block text-xl md:text-2xl mt-2 text-gray-600">
                  STARTiXの活動
                </span>
              </p>
              <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
              <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
                本気で夢を語り合える場所を作る。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full opacity-50 -mr-16 -mt-16"></div>
                <div className="w-16 h-16 bg-purple-100 rounded-2xl mb-6 flex items-center justify-center relative z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-lg md:text-xl font-bold mb-4 relative z-10">
                  アイデアソン
                </p>
                <p className="text-gray-600 text-sm md:text-base relative z-10">
                  定期的にアイデアソンを開催し、創造的な発想力を養います。様々な課題に対して、革新的なソリューションを生み出す力を鍛えます。
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100 rounded-full opacity-50 -mr-16 -mt-16"></div>
                <div className="w-16 h-16 bg-cyan-100 rounded-2xl mb-6 flex items-center justify-center relative z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-cyan-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <p className="text-lg md:text-xl font-bold mb-4 relative z-10">
                  ハッカソン
                </p>
                <p className="text-gray-600 text-sm md:text-base relative z-10">
                  アイデアを形にするハッカソンで、実践的なスキルを身につけます。プログラミングサークルとの連携し、プロトタイプ開発を通じて、技術力とチームワークを強化します。
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full opacity-50 -mr-16 -mt-16"></div>
                <div className="w-16 h-16 bg-orange-100 rounded-2xl mb-6 flex items-center justify-center relative z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg md:text-xl font-bold mb-4 relative z-10">
                  イベント参加
                </p>
                <p className="text-gray-600 text-sm md:text-base relative z-10">
                  クロスジャンルJAMや交流会など、様々なイベントに参加して交流を深めます。異なる分野の学生と出会い、新しい視点やアイデアを得ることができます。
                </p>
              </div>
            </div>

            {/* 実績カード: 中身の文字量でカード幅が変わってズレないよう、等幅グリッドで揃える */}
            <div className="grid grid-cols-2 gap-6 sm:gap-8 max-w-lg mx-auto mt-16">
              <div className="text-center bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                  15+
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  アクティブメンバー
                </p>
              </div>
              <div className="text-center bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                  20+
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  年間イベント数
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* メンバー紹介 */}
        <section className="py-20 bg-white relative">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Team
                <span className="block text-xl md:text-2xl mt-2 text-gray-600">
                  メンバー紹介
                </span>
              </h2>
              <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
              <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
                STARTiXの活動を支える中心メンバーです。多様なバックグラウンドと専門性を持ったメンバーが協力し、革新的なプロジェクトを推進しています。
              </p>
            </div>

            {/* タブレット幅で4列は窮屈になるため 2列 → 4列 の段階的グリッドにする */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden relative">
                <div className="relative h-64 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src="/images/kaienintro.JPG"
                    alt="STARTiX代表 小峯海円のプロフィール写真"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 relative">
                  <div className="absolute -top-8 left-6 bg-purple-600 text-white px-4 py-1 rounded-full text-sm z-20 shadow-lg">
                    代表
                  </div>
                  <p className="text-lg md:text-xl font-bold mb-2">
                    小峯 海円
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    社会工学類2年。大学1年次にSTARTiXを設立。複数のイベントに参加、インターンシップ経験、起業準備中。誰よりも起業に取り組む、勉強家。
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden relative">
                <div className="relative h-64 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src="/images/shojiintro.jpeg"
                    alt="STARTiX副代表 庄司悠太郎のプロフィール写真"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 relative">
                  <div className="absolute -top-8 left-6 bg-cyan-600 text-white px-4 py-1 rounded-full text-sm z-20 shadow-lg">
                    副代表
                  </div>
                  <p className="text-lg md:text-xl font-bold mb-2">
                    庄司 悠太郎
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    社会工学類3年生。インターンシップ経験、起業準備中。いつも笑顔なムードメーカー。長期休みに海外ボランティアに取り組むグローバルな視点を持つ。
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden relative">
                <div className="relative h-64 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src="/images/ryogointro.jpg"
                    alt="STARTiX副代表 細井崚吾のプロフィール写真"
                    fill
                    className="object-cover object-[center_25%]"
                  />
                </div>
                <div className="p-6 relative">
                  <div className="absolute -top-8 left-6 bg-cyan-600 text-white px-4 py-1 rounded-full text-sm z-20 shadow-lg">
                    副代表
                  </div>
                  <p className="text-lg md:text-xl font-bold mb-2">
                    細井 崚吾
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    社会工学類2年生。インターンシップ経験、起業準備中。AI使って楽するのが大好き。このホームページを作った張本人。キャンプが好きらしいのでBBQに行ってお肉を焼いてもらおう。
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden relative">
                <div className="relative h-64 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src="/images/takekiintro.JPG"
                    alt="STARTiX財務 森丈耀のプロフィール写真"
                    fill
                    className="object-cover object-[center_25%]"
                  />
                </div>
                <div className="p-6 relative">
                  <div className="absolute -top-8 left-6 bg-orange-600 text-white px-4 py-1 rounded-full text-sm z-20 shadow-lg">
                    財務
                  </div>
                  <p className="text-lg md:text-xl font-bold mb-2">森 丈耀</p>
                  <p className="text-gray-600 text-sm md:text-base">
                    東京大学農学部3年生。食に関する環境問題に取り組んでいる。どこからでも参加する、やる気No.1。STARTiXの財務を担当。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'STARTiX - 筑波大学の起業サークル',
  description: '起業を志す大学生が集まり、本気で夢を語り合えるコミュニティ。',
  openGraph: {
    title: 'STARTiX - 筑波大学の起業サークル',
    description: '起業を志す大学生が集まり、本気で夢を語り合えるコミュニティ。',
    // 相対パスは layout.tsx の metadataBase (startix-tsukuba.net) で解決される。
    // 旧Vercel URLのハードコードはSNSクローラーに旧ドメインを正規として渡すため廃止
    url: '/',
    siteName: 'STARTiX',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STARTiX - 筑波大学の起業サークル',
    description: '起業を志す大学生が集まり、本気で夢を語り合えるコミュニティ。',
    images: ['/images/startix-logo.png'],
  },
};
