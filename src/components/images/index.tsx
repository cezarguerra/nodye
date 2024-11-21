"use client";

import Image from "next/image";
import { useState } from "react";

export default function Images({
  originalUrl,
  blueChannelUrl,
  redChannelUrl,
  greenChannelUrl,
  evvUrl,
  edvUrl,
}: {
  originalUrl?: string | null;
  blueChannelUrl?: string | null;
  redChannelUrl?: string | null;
  greenChannelUrl?: string | null;
  evvUrl?: string | null;
  edvUrl?: string | null;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    originalUrl || null
  );

  return (
    <div className="flex h-full flex-row gap-4">
      <div className="mx-2 max-h-full w-full max-w-[150px] gap-4">
        {originalUrl && (
          <div className="flex flex-col items-center rounded-full">
            <h1 className="text-center text-sm">Original</h1>
            <div className="relative aspect-square w-full overflow-hidden rounded-full  border-2 border-orange-500">
              <Image
                src={originalUrl}
                alt="Original"
                fill
                className="object-cover"
                onClick={() => setSelectedImage(originalUrl)}
              />
            </div>
          </div>
        )}
        {redChannelUrl && (
          <div className="flex flex-col items-center rounded-full">
            <h1 className="text-center text-sm">Red Channel</h1>
            <div className="relative aspect-square w-full overflow-hidden rounded-full  border-2 border-orange-500">
              <Image
                src={redChannelUrl}
                alt="Red Channel"
                fill
                onClick={() => setSelectedImage(redChannelUrl)}
              />
            </div>
          </div>
        )}
        {greenChannelUrl && (
          <div className="flex flex-col items-center rounded-full">
            <h1 className="text-center text-sm">Green Channel</h1>
            <div className="relative aspect-square w-full overflow-hidden rounded-full  border-2 border-orange-500">
              <Image
                src={greenChannelUrl}
                alt="Green Channel"
                fill
                onClick={() => setSelectedImage(greenChannelUrl)}
              />
            </div>
          </div>
        )}
        {blueChannelUrl && (
          <div className="flex flex-col items-center rounded-full">
            <h1 className="text-center text-sm">Blue Channel</h1>
            <div className="relative aspect-square w-full overflow-hidden rounded-full  border-2 border-orange-500">
              <Image
                src={blueChannelUrl}
                alt="Blue Channel"
                fill
                onClick={() => setSelectedImage(blueChannelUrl)}
              />
            </div>
          </div>
        )}
        {evvUrl && (
          <div className="flex flex-col items-center rounded-full">
            <h1 className="text-center text-sm">
              Enhanced Vascular Visualization
            </h1>
            <div className="relative aspect-square w-full overflow-hidden rounded-full  border-2 border-orange-500">
              <Image
                src={evvUrl}
                alt="Enhanced Vascular Visualization"
                fill
                onClick={() => setSelectedImage(evvUrl)}
              />
            </div>
          </div>
        )}
        {edvUrl && (
          <div className="flex flex-col items-center rounded-full">
            <h1 className="text-center text-sm">
              Enhanced Drusen Visualization
            </h1>
            <div className="relative aspect-square w-full overflow-hidden rounded-full  border-2 border-orange-500">
              <Image
                src={edvUrl}
                alt="Enhanced Drusen Visualization"
                fill
                onClick={() => setSelectedImage(edvUrl)}
              />
            </div>
          </div>
        )}
      </div>
      <div className="max-h-screen w-full bg-gray-200">
        {selectedImage && (
          <div className="relative aspect-square max-h-full">
            <Image src={selectedImage} alt="Original" fill />
          </div>
        )}
      </div>
    </div>
  );
}
