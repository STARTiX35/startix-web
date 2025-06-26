"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="fixed w-full bg-white/90 backdrop-blur-sm shadow-sm z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/startix-logo.png"
              alt="STARTiX"
              width={48}
              height={48}
              className="mr-2"
            />
            <span className="text-xl font-bold text-purple-600">STARTiX</span>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-8 items-center">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/event"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  イベント
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </nav>
          <button
            className="md:hidden text-gray-700 hover:text-purple-600 transition-colors"
            aria-label="メニュー"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link
                    href="/"
                    className="block text-gray-700 hover:text-purple-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ホーム
                  </Link>
                </li>
                <li>
                  <Link
                    href="/event"
                    className="block text-gray-700 hover:text-purple-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    イベント
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="block text-gray-700 hover:text-purple-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </header>
      {/* メインコンテンツの開始位置を調整 */}
      <div className="pt-16" />
    </>
  );
}
