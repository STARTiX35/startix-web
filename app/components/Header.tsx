"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import RelativeLink from "./RelativeLink";

// ナビゲーション項目は PC / モバイルで共通なので一元管理する
const NAV_ITEMS = [
  { href: "/", label: "ホーム" },
  { href: "/event", label: "イベント" },
] as const;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // usePathname はハイドレーション前に null を返し得るため "/" にフォールバック
  // （RelativeLink.tsx と同じガード。片方だけ無防備だと isActive が throw する）
  const pathname = usePathname() ?? "/";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 現在ページのリンクをハイライトするための判定。
  // "/" は前方一致だと全ページに当たってしまうため完全一致にする
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="fixed w-full bg-white/90 backdrop-blur-sm shadow-sm z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <RelativeLink href="/" className="flex items-center gap-2">
            <Image
              src="/images/startix-logo.png"
              alt="STARTiX"
              width={40}
              height={40}
            />
            <span className="text-xl font-bold text-purple-600 tracking-wide">
              STARTiX
            </span>
          </RelativeLink>
          <nav className="hidden md:block">
            <ul className="flex space-x-8 items-center">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <RelativeLink
                    href={item.href}
                    className={`transition-colors font-medium ${
                      isActive(item.href)
                        ? "text-purple-600"
                        : "text-gray-700 hover:text-purple-600"
                    }`}
                  >
                    {item.label}
                  </RelativeLink>
                </li>
              ))}
              <li>
                {/* お問い合わせは行動導線なのでボタンとして目立たせる */}
                <RelativeLink
                  href="/contact"
                  className="inline-flex items-center px-5 py-2 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 shadow-sm hover:shadow-md transition-all"
                >
                  お問い合わせ
                </RelativeLink>
              </li>
            </ul>
          </nav>
          <button
            className="md:hidden text-gray-700 hover:text-purple-600 transition-colors"
            aria-label="メニュー"
            aria-expanded={isMenuOpen}
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
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <ul className="flex flex-col space-y-2">
                {[...NAV_ITEMS, { href: "/contact", label: "お問い合わせ" }].map(
                  (item) => (
                    <li key={item.href}>
                      <RelativeLink
                        href={item.href}
                        className={`block rounded-md transition-colors py-2 px-2 ${
                          isActive(item.href)
                            ? "text-purple-600 bg-purple-50 font-medium"
                            : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </RelativeLink>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        )}
      </header>
      {/* ヘッダー（fixed）分の高さを確保するスペーサー。
          ページ側で pt を足すと二重になるため、余白調整はここだけで行う */}
      <div className="pt-16" />
    </>
  );
}
