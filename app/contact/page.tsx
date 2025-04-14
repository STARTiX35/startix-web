'use client';

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaEnvelope, FaClock, FaMapMarkerAlt, FaTwitter, FaFacebookF } from 'react-icons/fa';
import Header from '../components/Header';
import Image from 'next/image';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400">
        <div className="container mx-auto px-4 py-16 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">お問い合わせ</h1>
          <p className="text-lg opacity-90">
            STARTiXに興味をお持ちいただき、ありがとうございます。ご質問、ご提案、サークル
            <br />活動などのお問い合わせはこちらからお願いします。
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* お気軽にご連絡ください セクション */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-center mb-6">お気軽にご連絡ください</h2>
            <p className="text-gray-600 text-center mb-8">
              STARTiXでは、起業に興味のある方、サークル活動に参加したい方、コラボレーション
              <br />を検討されている方など、さまざまなお問い合わせをお待ちしています。
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

          {/* 次回のイベント */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="order-2 md:order-1 bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">次回のイベント</h2>
              <div className="space-y-4">
                <div className="flex items-center text-purple-600">
                  <FaClock className="mr-2" />
                  <span>2025年4月19日（水）</span>
                </div>
                <div className="flex items-center text-purple-600">
                  <FaClock className="mr-2" />
                  <span>14:00 - 17:00（13:30受付開始）</span>
                </div>
                <div className="flex items-center text-purple-600">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>C3Lab（つくば市天久保3丁目19-5）</span>
                </div>
                <h3 className="text-xl font-bold mt-4">クロスジャンルJAM！新入生歓迎イベント</h3>
                <p className="text-gray-600 mt-2">
                  異なる学部の学生が集まり、交流ディスカッションを楽しむカジュアルイベントです。起業の知識がなくてもOK。サイコロを振ったトークで自然に打ち解ける「サイコロ自己紹介」、ランダムなキーワードでを発想する「逆算リストランチ」、ゲームで気軽に交流できる「雑談ボードゲーム」など、新しい仲間と、ここでしかできない体験を。
                </p>
                <div className="flex gap-4 mt-8">
                  <a href="https://lu.ma/ary5l3sj" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                    参加申し込み
                  </a>
                  <a href="https://aboard-bush-c04.notion.site/JAM-1b571d1219ea807d81d8d1fa374e8d33" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all">
                    詳細を見る
                  </a>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 bg-black rounded-3xl shadow-lg overflow-hidden h-48 md:h-auto relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <Image
              src="/images/events1.PNG"
              alt="クロスジャンルJam"
              width={600}
              height={800}
              className="w-full h-full object-contain"
            />
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
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
            <div className="flex justify-center space-x-6 w-full">
              <Link href="/" className="hover:text-purple-400 transition-colors w-[4em]">
              ホーム
              </Link>
              <Link href="/event" className="hover:text-purple-400 transition-colors w-[4em]">
              イベント
              </Link>
              <Link href="/contact" className="hover:text-purple-400 transition-colors w-[4em]">
              お問い合わせ
              </Link>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mt-8">
            <a href="https://www.instagram.com/startix.itf/profilecard/?igsh=MXA0emRxOHJjZzA5eA==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaInstagram size={24} />
            </a>
            <a href="https://x.com/itfstartix96591?s=21&t=15KV74Ta5zS_TKIkPFbC4w" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaTwitter size={24} />
            </a>
            <a href="https://www.facebook.com/people/Itf-Startix/pfbid027nvEi7gCpLPHuH1Qg1CbpVKZjA3XHQbGqMZQ51k3sZdQ1xxCHjv1S2KJHVogrucgl/?mibextid=wwXIfr&rdid=gdNK0ITlNNaI6OAK&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18eSC66KcS%2F%3Fmibextid%3DwwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaFacebookF size={24} />
            </a>
          </div>
          <div className="text-center mt-8 text-gray-400">
            <p>&copy; {new Date().getFullYear()} STARTiX - 筑波大学発インカレサークル. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
