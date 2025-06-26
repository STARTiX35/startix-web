import React from "react";
import Link from "next/link";
import {
  FaInstagram,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt,
  FaTwitter,
  FaFacebookF,
} from "react-icons/fa";
import Header from "../components/Header";
import Image from "next/image";
import { client } from "../lib/microcms";

export default async function Contact() {
  // MicroCMSから次回のイベントを取得
  const response = await client.get({
    endpoint: "events",
    queries: { filters: "category[contains]upcoming", limit: 1 },
  });
  const nextEvent = response.contents[0];

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400"></div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* お気軽にご連絡ください セクション */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-center mb-6">
              お気軽にご連絡下さい
            </h2>
            <p className="text-gray-600 text-center mb-8">
              STARTiXでは
              <br />
              参加希望・広告依頼・コラボレーション
              <br />
              お問い合わせをお待ちしています
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <a
                href="mailto:startix.itf@gmail.com"
                className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors w-full sm:w-auto"
              >
                <FaEnvelope className="mr-2" />
                メールでお問い合わせ
              </a>

              <a
                href="https://www.instagram.com/startix.itf/profilecard/?igsh=MXA0emRxOHJjZzA5eA=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto"
              >
                <FaInstagram className="mr-2" />
                Instagramでフォロー
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* メールアドレス */}
              <div className="flex items-start space-x-4 md:ml-[200px]">
                <FaEnvelope className="text-purple-600 text-xl mt-1" />
                <div>
                  <h3 className="font-bold mb-2">メールアドレス</h3>
                  <p className="text-gray-600">startix.itf@gmail.com</p>
                </div>
              </div>

              {/* 活動時間 */}
              <div className="flex items-start space-x-4">
                <FaClock className="text-purple-600 text-xl mt-1" />
                <div>
                  <h3 className="font-bold mb-2">活動時間</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>月2回のビジネス創出イベント</li>
                    <li>月1回のSTARTiX交流イベント</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 font-medium">SNSでもつながれます</p>
            </div>
          </div>

          {/* 次回のイベント - MicroCMSデータを使用 */}
          {nextEvent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="order-2 md:order-1 bg-white rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">次回のイベント</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-purple-600">
                    <FaClock className="mr-2" />
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
                    <FaClock className="mr-2" />
                    <span>{`${nextEvent.startTime} - ${nextEvent.endTime}`}</span>
                  </div>
                  <div className="flex items-center text-purple-600">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{nextEvent.location}</span>
                  </div>
                  <h3 className="text-xl font-bold mt-4">{nextEvent.title}</h3>
                  <p className="text-gray-600 mt-2">{nextEvent.description}</p>
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
              <div className="order-1 md:order-2 bg-black rounded-3xl shadow-lg overflow-hidden h-48 md:h-auto relative">
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
          )}
        </div>
      </main>
    </div>
  );
}
