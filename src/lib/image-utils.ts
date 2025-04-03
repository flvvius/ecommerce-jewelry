/**
 * Utility functions for handling image paths in a consistent way
 * across the application, accounting for environment differences
 */

/**
 * Generate a properly formatted image URL that works in both development and production
 * @param path The relative path to the image
 * @returns A properly formatted URL that works in both environments
 */
export function getImageUrl(path: string): string {
  if (!path) return "/placeholder.svg";

  // If the path is already a full URL, return it
  if (path.startsWith("http")) {
    return path;
  }

  // Always ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // In production, use the full base URL
  if (process.env.NODE_ENV === "production") {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "https://ecommerce-jewelry.vercel.app");

    // Ensure no double slashes between base URL and path
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}${normalizedPath}`;
  }

  // In development, just use the relative path as Next.js handles it correctly
  return normalizedPath;
}

/**
 * Generate a fallback image path for a product
 * @param slug The product slug
 * @param index The image index (0 for main image)
 * @returns The best available image path
 */
export function getProductImageFallback(slug: string, index = 0): string {
  if (!slug) return getImageUrl("/placeholder.svg");

  if (index === 0) {
    // Main product image options in order of preference
    return getImageUrl(`/images/jewelry/${slug}.jpg`);
  }

  // For additional images, just use placeholder
  return getImageUrl("/placeholder.svg");
}

/**
 * Get a compressed version of the product image
 * @param slug The product slug
 * @returns The compressed image path
 */
export function getCompressedProductImage(slug: string): string {
  if (!slug) return getImageUrl("/placeholder.svg");
  return getImageUrl(`/images/jewelry/compressed/${slug}.jpg`);
}
