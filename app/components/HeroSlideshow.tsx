'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

type Props = {
  images: { url: string }[];
};

export default function HeroSlideshow({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 5秒ごとに画像を切り替え

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.url}
            alt={`Slide ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      ))}
      
      {/* ナビゲーションドット */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-4'
                : 'bg-white/50'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 