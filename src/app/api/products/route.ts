import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm/sql";
import { products, productImages } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq, ilike, and, or, inArray } from "drizzle-orm/expressions";
import {
  fallbackProducts,
  getAllFallbackProducts,
  addAbsoluteUrlsToImages,
} from "~/app/api/fallback-data";

// Helpers for common operations
const createdAtColumn = sql`${products.createdAt}`;
const isFeaturedColumn = sql`${products.isFeatured}`;
const priceColumn = sql`${products.price}::numeric`;

export async function GET(request: NextRequest) {
  // Extract parameters with defaults - defined at function level
  let category: string | null = null;
  let featured: string | null = null;
  let sort: string = "featured";
  let price: string | null = null;
  let material: string | null = null;
  let slug: string | null = null;

  try {
    // First verify database connection is working
    console.log("Testing database connection...");
    let isDatabaseAvailable = false;

    try {
      await db.execute(sql`SELECT 1`);
      console.log("Database connection successful");
      isDatabaseAvailable = true;
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      // Instead of retrying, we'll immediately use fallback data
    }

    // Extra validation of database configuration
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is missing or improperly configured");
      isDatabaseAvailable = false;
    }

    // Parse URL parameters
    let searchParams = new URLSearchParams();

    try {
      console.log("Products API request URL:", request.url);
      const url = new URL(request.url);
      searchParams = url.searchParams;
      console.log("Query params:", Object.fromEntries(searchParams.entries()));
    } catch (urlError) {
      console.error("Error parsing URL:", urlError);
      const queryString = request.url.split("?")[1] || "";
      searchParams = new URLSearchParams(queryString);
    }

    // Extract parameters
    category = searchParams.get("category");
    featured = searchParams.get("featured");
    sort = searchParams.get("sort") || "featured";
    price = searchParams.get("price");
    material = searchParams.get("material");
    slug = searchParams.get("slug");

    // If database is not available, immediately use fallback data
    if (!isDatabaseAvailable) {
      return getFallbackProducts(category, featured, material, price, sort);
    }

    // Start building the query
    let query = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        discountPrice: products.discountPrice,
        category: products.category,
        material: products.material,
        slug: products.slug,
        isFeatured: products.isFeatured,
        isNew: products.isNew,
        isBestseller: products.isBestseller,
        createdAt: products.createdAt,
        images: sql<
          string[]
        >`coalesce(json_agg(json_build_object('url', ${productImages.url}, 'altText', ${productImages.altText})) FILTER (WHERE ${productImages.url} IS NOT NULL), '[]'::json)`,
      })
      .from(products)
      .leftJoin(productImages, eq(products.id, productImages.productId));

    // Apply filters conditionally
    const whereConditions = [];

    if (category) {
      whereConditions.push(eq(products.category, category));
    }

    if (featured === "true") {
      whereConditions.push(eq(products.isFeatured, true));
    }

    if (slug) {
      whereConditions.push(eq(products.slug, slug));
    }

    if (material) {
      whereConditions.push(ilike(products.material, `%${material}%`));
    }

    if (price) {
      switch (price) {
        case "under-500":
          whereConditions.push(sql`${priceColumn} < 500`);
          break;
        case "500-1000":
          whereConditions.push(
            sql`${priceColumn} >= 500 AND ${priceColumn} <= 1000`,
          );
          break;
        case "1000-2000":
          whereConditions.push(
            sql`${priceColumn} >= 1000 AND ${priceColumn} <= 2000`,
          );
          break;
        case "over-2000":
          whereConditions.push(sql`${priceColumn} > 2000`);
          break;
      }
    }

    // Apply all where conditions if any exist
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    // Group by all product fields to handle the json_agg
    query = query.groupBy(products.id);

    // Apply sorting
    switch (sort) {
      case "price-low-high":
        query = query.orderBy(sql`${priceColumn} asc`);
        break;
      case "price-high-low":
        query = query.orderBy(sql`${priceColumn} desc`);
        break;
      case "newest":
        query = query.orderBy(sql`${createdAtColumn} desc`);
        break;
      default:
        // Default sorting: featured items first, then newest
        query = query.orderBy(
          sql`${isFeaturedColumn} desc`,
          sql`${createdAtColumn} desc`,
        );
        break;
    }

    // Execute the query with a timeout
    const result = await query;

    // If no results from database, return fallback data
    if (!result || result.length === 0) {
      console.log("No products found in database, using fallback data");
      return getFallbackProducts(category, featured, material, price, sort);
    }

    // Map the results to include proper JSON for images
    const mappedResults = result.map((product: any) => {
      // Parse images if it's a string
      let parsedImages;
      try {
        parsedImages =
          typeof product.images === "string"
            ? JSON.parse(product.images)
            : product.images;
      } catch (e) {
        parsedImages = [];
      }

      // Add a default image if no images are available
      if (
        !parsedImages ||
        parsedImages.length === 0 ||
        parsedImages[0].url === null
      ) {
        parsedImages = [
          {
            url: `/images/jewelry/${product.slug}.jpg`,
            altText: product.name,
          },
        ];
      }

      // Process images to convert relative URLs to absolute URLs for production
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      parsedImages = parsedImages.map((image: any) => {
        if (image.url && image.url.startsWith("/")) {
          return {
            ...image,
            url: `${baseUrl}${image.url}`,
          };
        }
        return image;
      });

      return {
        ...product,
        images: parsedImages,
      };
    });

    // Return the products
    return NextResponse.json(mappedResults);
  } catch (error) {
    console.error("Error fetching products:", error);
    // Use fallback data as the last resort
    return getFallbackProducts(category, featured, material, price, sort);
  }
}

// Helper function to get filtered fallback products
function getFallbackProducts(
  category: string | null,
  featured: string | null,
  material: string | null,
  price: string | null,
  sort: string,
) {
  let fallbackData = getAllFallbackProducts();

  // Apply filters to fallback data
  if (category) {
    fallbackData = fallbackData.filter((p) => p.category === category);
  }

  if (featured === "true") {
    fallbackData = fallbackData.filter((p) => p.isFeatured);
  }

  // Handle material filter
  if (material) {
    fallbackData = fallbackData.filter(
      (p) =>
        p.material &&
        p.material.toLowerCase().includes(material?.toLowerCase() || ""),
    );
  }

  // Handle price filter
  if (price) {
    const numericPrice = (p: any) => parseFloat(p.price);

    switch (price) {
      case "under-500":
        fallbackData = fallbackData.filter((p) => numericPrice(p) < 500);
        break;
      case "500-1000":
        fallbackData = fallbackData.filter(
          (p) => numericPrice(p) >= 500 && numericPrice(p) <= 1000,
        );
        break;
      case "1000-2000":
        fallbackData = fallbackData.filter(
          (p) => numericPrice(p) >= 1000 && numericPrice(p) <= 2000,
        );
        break;
      case "over-2000":
        fallbackData = fallbackData.filter((p) => numericPrice(p) > 2000);
        break;
    }
  }

  // Apply sorting
  switch (sort) {
    case "price-low-high":
      fallbackData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case "price-high-low":
      fallbackData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case "newest":
      fallbackData.sort((a, b) => b.id - a.id);
      break;
    default:
      fallbackData.sort((a, b) => {
        if (a.isFeatured === b.isFeatured) {
          return b.id - a.id;
        }
        return a.isFeatured ? -1 : 1;
      });
      break;
  }

  // Add image paths
  fallbackData = fallbackData.map((product) => ({
    ...product,
    images: [
      {
        url: `/images/jewelry/${product.slug}.jpg`,
        altText: product.name,
      },
    ],
  }));

  return NextResponse.json(addAbsoluteUrlsToImages(fallbackData));
}
