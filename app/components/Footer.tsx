import Image from "next/image";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import RelativeLink from "./RelativeLink";

// SNSリンクを一元管理する。aria-label はスクリーンリーダー向けの読み上げ用
const SNS_LINKS = [
  {
    href: "https://www.instagram.com/startix.itf/profilecard/?igsh=MXA0emRxOHJjZzA5eA==",
    label: "Instagram",
    Icon: FaInstagram,
  },
  {
    href: "https://x.com/itfstartix96591?s=21&t=15KV74Ta5zS_TKIkPFbC4w",
    label: "X (旧Twitter)",
    Icon: FaXTwitter,
  },
  {
    href: "https://www.facebook.com/people/Itf-Startix/pfbid027nvEi7gCpLPHuH1Qg1CbpVKZjA3XHQbGqMZQ51k3sZdQ1xxCHjv1S2KJHVogrucgl/?mibextid=wwXIfr&rdid=gdNK0ITlNNaI6OAK&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18eSC66KcS%2F%3Fmibextid%3DwwXIfr",
    label: "Facebook",
    Icon: FaFacebookF,
  },
] as const;

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          {/* ロゴ + キャッチコピー */}
          <div className="text-center">
            <RelativeLink
              href="/"
              className="inline-flex items-center justify-center gap-2"
            >
              <div className="bg-white rounded-full p-1">
                <Image
                  src="/images/startix-logo.png"
                  alt="STARTiX"
                  width={44}
                  height={44}
                />
              </div>
              <span className="text-2xl font-bold text-white tracking-wide">
                STARTiX
              </span>
            </RelativeLink>
            <p className="text-gray-400 mt-3">
              本気で夢を語り合える場所を作る。
            </p>
          </div>

          {/* サイト内ナビゲーション。
              リンクの文字幅がバラバラ（ホーム < イベント < お問い合わせ）なため、
              単純な flex 中央寄せだと中央の「イベント」がロゴの真下からズレ、
              等幅3カラムだと今度はリンク間の空きが不均等に見える。
              [1fr_auto_1fr] グリッドで中央カラムをロゴの真下に固定し、
              左右のリンクを中央カラムに寄せる（gap で等間隔を保証）ことで
              「中央揃え」と「等間隔」を両立する（2026-07-17 修正） */}
          <nav aria-label="フッターナビゲーション">
            <ul className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-10 w-full max-w-md mx-auto">
              <li className="justify-self-end">
                <RelativeLink
                  href="/"
                  className="text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap"
                >
                  ホーム
                </RelativeLink>
              </li>
              <li className="justify-self-center">
                <RelativeLink
                  href="/event"
                  className="text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap"
                >
                  イベント
                </RelativeLink>
              </li>
              <li className="justify-self-start">
                <RelativeLink
                  href="/contact"
                  className="text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap"
                >
                  お問い合わせ
                </RelativeLink>
              </li>
            </ul>
          </nav>

          {/* SNS */}
          <div className="flex justify-center gap-6">
            {SNS_LINKS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} STARTiX -
            筑波大学発インカレサークル. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
