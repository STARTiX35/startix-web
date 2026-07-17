import React from "react";
import { FaInstagram, FaEnvelope, FaClock, FaArrowRight } from "react-icons/fa";
import RelativeLink from "../components/RelativeLink";

// イベント詳細はホームとイベントページに集約する方針にしたため、
// このページの「次回のイベント」ブロックと MicroCMS fetch は削除した（2026-07-17）。
// これによりお問い合わせページは CMS 非依存の静的ページになる。
export default function Contact() {
  return (
    // 背景が真っ白だと白いカードが埋もれて境界が見えないため、
    // 他ページのヒーローと同じ薄紫グラデーションを敷いてカードを浮かせる（2026-07-17 修正）
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* お気軽にご連絡ください セクション */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
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

            {/* 固定マージン（ml-[200px]）での位置合わせは画面幅でズレるため、
                コンテンツ幅を絞って中央寄せする方式に変更（2026-07-17 修正） */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
              {/* メールアドレス */}
              <div className="flex items-start space-x-4">
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

          {/* イベントへの導線は1行リンクだけ残す */}
          <div className="text-center mt-10">
            <RelativeLink
              href="/event"
              className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              イベント情報を見る
              <FaArrowRight className="ml-2" />
            </RelativeLink>
          </div>
        </div>
      </main>
    </div>
  );
}
