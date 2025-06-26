import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";

export default function Footer() {
  return (
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
            <p className="text-gray-400 mt-2 text-center">
              起業を志す大学生の起業サークルです。
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="/"
              className="hover:text-purple-400 transition-colors whitespace-nowrap"
            >
              ホーム
            </Link>
            <Link
              href="/event"
              className="hover:text-purple-400 transition-colors whitespace-nowrap"
            >
              イベント
            </Link>
            <Link
              href="/contact"
              className="hover:text-purple-400 transition-colors whitespace-nowrap"
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
  );
}
