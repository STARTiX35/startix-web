import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Header from "./components/Header";
import HeroSlideshow from "./components/HeroSlideshow";
import { client, Event, HeroImage } from "./lib/microcms";
import { Metadata } from "next";

// サーバーコンポーネントに変更（'use client'を削除）
export const revalidate = 3600; // 1時間（秒単位）

export default async function Home() {
  // MicroCMSから次回のイベントを取得
  const response = await client.getList({
    endpoint: "events",
    queries: { filters: "category[contains]upcoming", limit: 1 },
  });
  const nextEvent = response.contents[0];

  // ヒーロー画像を取得
  const heroImages = await client.getList({
    endpoint: "hero",
  });

  return (
    <div className="min-h-screen bg-white">
      {/* メインコンテンツの開始位置を調整 */}
      <div className="pt-0 md:pt-16">
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
                <Link
                  href="/event"
                  className="inline-flex items-center px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  次回イベントに参加
                </Link>
              </div>
              <div className="relative order-1 md:order-2 h-[400px] md:h-[500px]">
                <HeroSlideshow
                  images={heroImages.contents.map(
                    (item: HeroImage) => item.image
                  )}
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
                      <a
                        href={nextEvent.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                      >
                        参加申し込み
                      </a>
                      <a
                        href={nextEvent.detailsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
                      >
                        詳細を見る
                      </a>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2 bg-black rounded-3xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 relative h-48 md:h-auto">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src={nextEvent.imageUrl.url}
                    alt={nextEvent.title}
                    width={600}
                    height={800}
                    className="w-full h-full object-contain"
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

            <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-20 mt-16">
              <div className="text-center bg-white rounded-3xl p-6 sm:p-8 shadow-lg w-full sm:w-auto">
                <div className="text-2xl md:text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
                  15+
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  アクティブメンバー
                </p>
              </div>
              <div className="text-center bg-white rounded-3xl p-6 sm:p-8 shadow-lg w-full sm:w-auto">
                <div className="text-2xl md:text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
    url: 'https://startix-web-iota.vercel.app/',
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
