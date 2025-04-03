// Define consistent product types to ensure type safety
export interface FallbackProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  material: string;
  slug: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  images: Array<{
    url: string;
    altText: string;
  }>;
}

// Record of available fallback products by slug
export interface FallbackProductsRecord {
  [key: string]: FallbackProduct;
}

// Centralized fallback data
export const fallbackProducts: FallbackProductsRecord = {
  "diamond-pendant-necklace": {
    id: 1,
    name: "Diamond Pendant Necklace",
    description:
      "A stunning diamond pendant necklace set in 14k gold. This elegant piece features a brilliant-cut diamond suspended from a delicate gold chain.",
    price: "1299.00",
    category: "necklaces",
    material: "Gold",
    slug: "diamond-pendant-necklace",
    isFeatured: true,
    isNew: true,
    isBestseller: false,
    images: [
      {
        url: "/images/jewelry/diamond-pendant-necklace.jpg",
        altText: "Diamond Pendant Necklace",
      },
    ],
  },
  "gold-hoop-earrings": {
    id: 2,
    name: "Gold Hoop Earrings",
    description:
      "Classic gold hoop earrings, perfect for any occasion. These lightweight hoops have a comfortable hinged closure and reflect light beautifully with their polished finish.",
    price: "499.00",
    category: "earrings",
    material: "Gold",
    slug: "gold-hoop-earrings",
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    images: [
      {
        url: "/images/jewelry/gold-hoop-earrings.jpg",
        altText: "Gold Hoop Earrings",
      },
    ],
  },
  "sapphire-tennis-bracelet": {
    id: 3,
    name: "Sapphire Tennis Bracelet",
    description:
      "Elegant sapphire tennis bracelet set in white gold. This bracelet features a continuous line of deep blue sapphires secured with a sturdy clasp.",
    price: "899.00",
    category: "bracelets",
    material: "White Gold",
    slug: "sapphire-tennis-bracelet",
    isFeatured: true,
    isNew: true,
    isBestseller: false,
    images: [
      {
        url: "/images/jewelry/sapphire-tennis-bracelet.jpg",
        altText: "Sapphire Tennis Bracelet",
      },
    ],
  },
  "emerald-cut-engagement-ring": {
    id: 4,
    name: "Emerald Cut Engagement Ring",
    description:
      "Beautiful emerald cut diamond engagement ring. The sleek emerald cut creates elegant flashes of light while the platinum band provides a secure setting and lasting durability.",
    price: "2499.00",
    category: "rings",
    material: "Platinum",
    slug: "emerald-cut-engagement-ring",
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    images: [
      {
        url: "/images/jewelry/emerald-cut-engagement-ring.jpg",
        altText: "Emerald Cut Engagement Ring",
      },
    ],
  },
  "pearl-stud-earrings": {
    id: 5,
    name: "Pearl Stud Earrings",
    description:
      "Classic pearl stud earrings featuring lustrous freshwater pearls set in 14k gold. A timeless addition to any jewelry collection.",
    price: "349.00",
    category: "earrings",
    material: "Gold",
    slug: "pearl-stud-earrings",
    isFeatured: false,
    isNew: true,
    isBestseller: false,
    images: [
      {
        url: "/images/jewelry/pearl-stud-earrings.jpg",
        altText: "Pearl Stud Earrings",
      },
    ],
  },
  "silver-diamond-ring": {
    id: 6,
    name: "Silver Diamond Ring",
    description:
      "Elegant silver ring with a small diamond accent. Perfect for everyday wear with a subtle sparkle.",
    price: "599.00",
    category: "rings",
    material: "Silver",
    slug: "silver-diamond-ring",
    isFeatured: false,
    isNew: false,
    isBestseller: true,
    images: [
      {
        url: "/images/jewelry/silver-diamond-ring.jpg",
        altText: "Silver Diamond Ring",
      },
    ],
  },
  "vintage-inspired-necklace": {
    id: 7,
    name: "Vintage Inspired Necklace",
    description:
      "A beautiful vintage-inspired pendant necklace with intricate detailing and gemstone accents.",
    price: "799.00",
    category: "necklaces",
    material: "Gold",
    slug: "vintage-inspired-necklace",
    isFeatured: false,
    isNew: true,
    isBestseller: false,
    images: [
      {
        url: "/images/jewelry/vintage-inspired-necklace.jpg",
        altText: "Vintage Inspired Necklace",
      },
    ],
  },
  "pearl-drop-earrings": {
    id: 8,
    name: "Pearl Drop Earrings",
    description:
      "Elegant pearl drop earrings featuring freshwater pearls suspended from delicate gold chains.",
    price: "449.00",
    category: "earrings",
    material: "Gold",
    slug: "pearl-drop-earrings",
    isFeatured: false,
    isNew: false,
    isBestseller: true,
    images: [
      {
        url: "/images/jewelry/pearl-drop-earrings.jpg",
        altText: "Pearl Drop Earrings",
      },
    ],
  },
};

// Helper function to add absolute URLs to image paths
export function addAbsoluteUrlsToImages(
  products: FallbackProduct[] | FallbackProduct,
): FallbackProduct[] | FallbackProduct {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof process !== "undefined" && process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://ecommerce-jewelry.vercel.app");

  // Helper function to resolve an image path
  const getImageUrl = (productSlug: string) => {
    // Construct path - will be made absolute below
    return `/images/jewelry/${productSlug}.jpg`;
  };

  // Helper function to ensure a path has a proper absolute URL
  const ensureAbsoluteUrl = (path: string) => {
    if (!path) return `${baseUrl}/placeholder.svg`;
    if (path.startsWith("http")) return path;

    // Add base URL if it's a relative path
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  };

  if (Array.isArray(products)) {
    return products.map((product) => ({
      ...product,
      images:
        product.images.length > 0
          ? product.images.map((image) => ({
              ...image,
              url: ensureAbsoluteUrl(image.url),
            }))
          : [
              {
                url: ensureAbsoluteUrl(getImageUrl(product.slug)),
                altText: product.name,
              },
            ],
    }));
  } else {
    return {
      ...products,
      images:
        products.images.length > 0
          ? products.images.map((image) => ({
              ...image,
              url: ensureAbsoluteUrl(image.url),
            }))
          : [
              {
                url: ensureAbsoluteUrl(getImageUrl(products.slug)),
                altText: products.name,
              },
            ],
    };
  }
}

// Get all fallback products as an array
export function getAllFallbackProducts(): FallbackProduct[] {
  return Object.values(fallbackProducts);
}
