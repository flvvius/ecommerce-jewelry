"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getImageUrl,
  getProductImageFallback,
  getCompressedProductImage,
} from "~/lib/image-utils";

export default function ImageDebug({ slug }: { slug: string }) {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Define all possible image paths
  const imagePaths = [
    getProductImageFallback(slug),
    getCompressedProductImage(slug),
    getImageUrl("/placeholder.svg"),
  ];

  const relativePaths = [
    `/images/jewelry/${slug}.jpg`,
    `/images/jewelry/compressed/${slug}.jpg`,
    "/placeholder.svg",
  ];

  // Handle successful image load
  const handleLoad = (path: string) => {
    setLoaded((prev) => ({ ...prev, [path]: true }));
  };

  // Handle image error
  const handleError = (path: string) => {
    setErrors((prev) => ({ ...prev, [path]: true }));
  };

  return (
    <div className="my-4 rounded-md border border-gray-300 bg-gray-100 p-4 text-sm">
      <h3 className="mb-2 font-bold">Image Debug - {slug}</h3>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {imagePaths.map((path, index) => (
          <div key={index} className="rounded-md border border-gray-200 p-2">
            <div className="relative mb-2 bg-black" style={{ height: "100px" }}>
              <Image
                src={path}
                alt={`Test ${index + 1}`}
                fill
                className="object-contain"
                onLoad={() => handleLoad(path)}
                onError={() => handleError(path)}
              />
            </div>
            <div className="text-xs">
              <p className="truncate">
                <strong>Path:</strong> {relativePaths[index]}
              </p>
              <p className="truncate">
                <strong>Full URL:</strong> {path}
              </p>
              <p>
                <strong>Status:</strong>
                {loaded[path] && (
                  <span className="text-green-600"> Loaded ✓</span>
                )}
                {errors[path] && (
                  <span className="text-red-600"> Failed ✗</span>
                )}
                {!loaded[path] && !errors[path] && (
                  <span className="text-gray-600"> Loading...</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-xs">
        <p>
          <strong>Public URL:</strong>{" "}
          {process.env.NEXT_PUBLIC_APP_URL || "Not set"}
        </p>
        <p>
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </p>
        <p>
          <strong>Origin:</strong>{" "}
          {typeof window !== "undefined"
            ? window.location.origin
            : "Server-rendered"}
        </p>
      </div>
    </div>
  );
}
