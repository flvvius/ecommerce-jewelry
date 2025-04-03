"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: { url: string; altText?: string }[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="bg-muted aspect-square w-full overflow-hidden rounded-xl">
        <Image
          src="/placeholder.svg"
          alt={productName}
          width={600}
          height={600}
          className="h-full w-full object-cover"
          priority
        />
      </div>
    );
  }

  // Show gallery
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-muted col-span-4 aspect-square overflow-hidden rounded-xl">
        <Image
          src={images[0].url}
          alt={images[0].altText || productName}
          width={800}
          height={800}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      {images.slice(1, 5).map((image, index) => (
        <div
          key={index}
          className="bg-muted aspect-square overflow-hidden rounded-xl"
        >
          <Image
            src={image.url}
            alt={image.altText || `${productName} ${index + 1}`}
            width={300}
            height={300}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
