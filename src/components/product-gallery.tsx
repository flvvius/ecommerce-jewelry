"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: { url: string; altText?: string }[];
  productName: string;
  slug?: string;
}

export default function ProductGallery({
  images,
  productName,
  slug,
}: ProductGalleryProps) {
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  // Get a fallback image URL for a specific index
  const getFallbackImageUrl = (index = 0) => {
    if (!slug) return "/placeholder.svg";

    if (index === 0) {
      // Try different paths in sequence
      if (imageError[`/images/jewelry/${slug}.jpg`]) {
        if (imageError[`/images/jewelry/compressed/${slug}.jpg`]) {
          return "/placeholder.svg";
        }
        return `/images/jewelry/compressed/${slug}.jpg`;
      }
      return `/images/jewelry/${slug}.jpg`;
    }

    // For secondary images, just use placeholder
    return "/placeholder.svg";
  };

  // Handler for image loading errors
  const handleImageError = (url: string) => {
    setImageError((prev) => ({
      ...prev,
      [url]: true,
    }));
  };

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="bg-muted aspect-square w-full overflow-hidden rounded-xl">
        <Image
          src={getFallbackImageUrl()}
          alt={productName}
          width={600}
          height={600}
          className="h-full w-full object-cover"
          priority
          onError={() => handleImageError(getFallbackImageUrl())}
        />
      </div>
    );
  }

  // Show gallery
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-muted col-span-4 aspect-square overflow-hidden rounded-xl">
        <Image
          src={
            imageError[images[0].url] ? getFallbackImageUrl() : images[0].url
          }
          alt={images[0].altText || productName}
          width={800}
          height={800}
          className="h-full w-full object-cover"
          priority
          onError={() => handleImageError(images[0].url)}
        />
      </div>
      {images.slice(1, 5).map((image, index) => (
        <div
          key={index}
          className="bg-muted aspect-square overflow-hidden rounded-xl"
        >
          <Image
            src={
              imageError[image.url] ? getFallbackImageUrl(index + 1) : image.url
            }
            alt={image.altText || `${productName} ${index + 1}`}
            width={300}
            height={300}
            className="h-full w-full object-cover"
            onError={() => handleImageError(image.url)}
          />
        </div>
      ))}
    </div>
  );
}
