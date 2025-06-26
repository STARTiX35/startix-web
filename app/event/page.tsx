import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";
import Header from "../components/Header";
import { client } from "../lib/microcms";
import type { Event } from "../lib/microcms";
// サーバーコンポーネントに変更
export const revalidate = 86400; // 24時間（秒単位）
export default async function EventPage() {
  // MicroCMSからデータを取得
  const response = await client.getList({
    endpoint: "events",
    queries: { filters: "category[contains]upcoming" },
  });

  const upcomingEvents = response.contents.map((event: Event) => ({
    id: event.id,
    title: event.title,
    date: new Date(event.date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    }),
    time: `${event.startTime} - ${event.endTime}`,
    location: event.location,
    description: event.description,
    image: event.imageUrl.url,
    registrationUrl: event.registrationUrl,
    detailsUrl: event.detailsUrl,
  }));

  // 過去のイベントを取得
  const pastResponse = await client.getList({
    endpoint: "events",
    queries: { filters: "category[not_contains]upcoming" },
  });

  const pastEvents = pastResponse.contents.map((event: Event) => ({
    id: event.id,
    title: event.title,
    date: new Date(event.date).toLocaleDateString("ja-JP"),
    description: event.description,
    image: event.imageUrl.url,
    detailsUrl: event.detailsUrl,
  }));

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-0 md:pt-16">
        {/* ヒーローセクション */}
        <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full opacity-50 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-50 -ml-32 -mb-32"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Events
                <span className="block text-xl md:text-2xl mt-2 text-gray-600">
                  イベント情報
                </span>
              </h1>
              <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
              <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
                STARTiXでは、
                <br />
                定期的にイベントを開催しています。起業に興味のある学生が集まり、交流を深めています。
              </p>
            </div>
          </div>
        </div>

        {/* 開催予定のイベント */}
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

            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="order-2 md:order-1 bg-white rounded-3xl shadow-lg p-8 transform transition-transform hover:scale-105 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full opacity-50 -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 -ml-16 -mb-16"></div>
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center text-purple-600">
                        <FaCalendarAlt className="h-6 w-6 mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-purple-600">
                        <FaClock className="h-6 w-6 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-purple-600">
                        <FaMapMarkerAlt className="h-6 w-6 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mt-6 mb-4">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-base md:text-lg">
                        {event.description}
                      </p>
                      <div className="flex gap-4 mt-8">
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                        >
                          参加申し込み
                        </a>
                        <a
                          href={event.detailsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
                        >
                          詳細を見る
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="order-1 md:order-2 bg-black rounded-3xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 relative h-48 md:h-auto">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src={upcomingEvents[0]?.image || "/images/events1.PNG"}
                    alt={upcomingEvents[0]?.title || "イベント画像"}
                    width={600}
                    height={800}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center bg-gray-50 rounded-3xl p-12">
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
                  開催予定のイベントはありません。
                </p>
                <p className="text-gray-600 mt-2">
                  定期的にイベントを開催していますので、またチェックしてください。
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 過去のイベント */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full opacity-50 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-50 -ml-32 -mb-32"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                過去のイベント
                <span className="block text-xl md:text-2xl mt-2 text-gray-600">
                  Past Events
                </span>
              </h2>
              <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
            </div>

            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event) => (
                  <Link
                    href={event.detailsUrl}
                    key={event.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-3xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 relative flex flex-col h-full"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full opacity-50 -mr-12 -mt-12"></div>
                    <div className="relative h-48">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 relative z-10 flex flex-col flex-grow">
                      <div>
                        <div className="text-sm text-purple-600 mb-2">
                          {event.date}
                        </div>
                        <h3 className="text-lg md:text-xl font-bold mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base">
                          {event.description}
                        </p>
                      </div>
                      <div className="mt-auto pt-4 text-right">
                        <span className="text-purple-600 font-medium hover:text-purple-700 transition-colors flex items-center justify-end">
                          詳細を見る <FaArrowRight className="ml-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl shadow-lg p-8 transform transition-transform hover:scale-105 relative overflow-hidden">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-600 text-lg">
                    過去のイベントはまだありません。
                  </p>
                  <p className="text-gray-600 mt-2">
                    STARTiXの活動が始まったばかりです。今後のイベントをお楽しみに！
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* フッター */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <Link href="/" className="flex items-center justify-center">
                  <div className="bg-white rounded-full p-1 mr-2">
                    <Image
                      src="/images/startix-logo.png"
                      alt="STARTiX"
                      width={48}
                      height={48}
                    />
                  </div>
                  <span className="text-2xl font-bold text-white">STARTiX</span>
                </Link>
                <p className="text-gray-400 mt-2">
                  起業を志す大学生の起業サークルです。
                </p>
              </div>
              <div className="flex space-x-6">
                <Link
                  href="/"
                  className="hover:text-purple-400 transition-colors w-[4em]"
                >
                  ホーム
                </Link>
                <Link
                  href="/event"
                  className="hover:text-purple-400 transition-colors w-[4em]"
                >
                  イベント
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-purple-400 transition-colors w-[4em]"
                >
                  お問い合わせ
                </Link>
              </div>
            </div>
            <div className="flex justify-center space-x-6 mt-8">
              <a
                href="https://www.instagram.com/startix.itf/profilecard/?igsh=MXA0emRxOHJjZzA5eA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://x.com/itfstartix96591?s=21&t=15KV74Ta5zS_TKIkPFbC4w"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://www.facebook.com/people/Itf-Startix/pfbid027nvEi7gCpLPHuH1Qg1CbpVKZjA3XHQbGqMZQ51k3sZdQ1xxCHjv1S2KJHVogrucgl/?mibextid=wwXIfr&rdid=gdNK0ITlNNaI6OAK&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18eSC66KcS%2F%3Fmibextid%3DwwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <FaFacebookF size={24} />
              </a>
            </div>
            <div className="text-center mt-8 text-gray-400">
              <p>
                &copy; {new Date().getFullYear()} STARTiX -
                筑波大学発インカレサークル. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
