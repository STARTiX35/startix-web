'use client';

import React, { FC } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="p-4">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <nav className="mt-8">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/event"
                  className="block text-gray-700 hover:text-purple-600 transition-colors py-2"
                  onClick={onClose}
                >
                  イベント
                </Link>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="block text-gray-700 hover:text-purple-600 transition-colors py-2"
                  onClick={onClose}
                >
                  活動紹介
                </a>
              </li>
              <li>
                <a 
                  href="#members" 
                  className="block text-gray-700 hover:text-purple-600 transition-colors py-2"
                  onClick={onClose}
                >
                  メンバー紹介
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block text-gray-700 hover:text-purple-600 transition-colors py-2"
                  onClick={onClose}
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
