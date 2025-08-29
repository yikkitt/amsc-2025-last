'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Banner() {
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="w-full bg-white py-3 text-center z-50 shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex justify-center items-center">
        {imageError ? (
          <div className="text-center p-4 text-gray-500">
            Banner image not found. Please ensure the image is placed at:<br/>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">public/images/ddcon-2025-banner.png</code>
          </div>
        ) : (
          <div className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <Image 
              src="/images/ddcon-2025-banner.png"
              alt="DDCON 2025 Malaysia - 6-7 August"
              width={600}
              height={160}
              priority
              className="max-w-full h-auto"
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
} 