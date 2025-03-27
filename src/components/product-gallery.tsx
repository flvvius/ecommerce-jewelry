"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="bg-muted aspect-square overflow-hidden rounded-lg">
        <img
          src={images[mainImage] || "/placeholder.svg"}
          alt={productName}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`bg-muted aspect-square overflow-hidden rounded-md ${
              mainImage === index ? "ring-primary ring-2" : ""
            }`}
            onClick={() => setMainImage(index)}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`${productName} ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
