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
  let retries = 3;
  while (retries > 0) {
    try {
      // First verify database connection is working
      console.log("Testing database connection...");
      try {
        await db.execute(sql`SELECT 1`);
        console.log("Database connection successful");
      } catch (dbError) {
        console.error("Database connection failed:", dbError);
        throw new Error("Database connection failed");
      }

      console.log(
        "Using database URL:",
        process.env.DATABASE_URL?.substring(0, 15) + "...",
      );

      // Extra validation of database configuration
      if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is missing or improperly configured");
        return NextResponse.json(
          {
            error: "Database configuration error",
            details: "Missing DATABASE_URL",
          },
          { status: 500 },
        );
      }

      // Safer URL parsing with robust error handling and debugging
      let searchParams = new URLSearchParams();

      try {
        console.log("Products API request URL:", request.url);

        // First attempt: Try to parse the URL directly
        const url = new URL(request.url);
        searchParams = url.searchParams;
        console.log(
          "Query params:",
          Object.fromEntries(searchParams.entries()),
        );
      } catch (urlError) {
        console.error("Error parsing URL:", urlError);

        // Second attempt: Try to extract query parameters directly
        const queryString = request.url.split("?")[1] || "";
        searchParams = new URLSearchParams(queryString);
        console.log(
          "Fallback query parsing:",
          Object.fromEntries(searchParams.entries()),
        );
      }

      // Extract parameters with defaults
      const category = searchParams.get("category");
      const featured = searchParams.get("featured");
      const sort = searchParams.get("sort") || "featured";
      const price = searchParams.get("price");
      const material = searchParams.get("material");
      const slug = searchParams.get("slug");

      if (material) {
        console.log("Searching for material:", material);
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

      // Execute the query
      const result = await query;

      // If no results from database, return fallback data
      if (!result || result.length === 0) {
        console.log("No products found in database, using fallback data");
        let filteredProducts = getAllFallbackProducts();

        // Apply appropriate filters as above
        if (category) {
          filteredProducts = filteredProducts.filter(
            (p) => p.category === category,
          );
        }

        if (featured === "true") {
          filteredProducts = filteredProducts.filter((p) => p.isFeatured);
        }

        // Process images to add absolute URLs
        filteredProducts = addAbsoluteUrlsToImages(filteredProducts) as any[];

        return NextResponse.json(filteredProducts);
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
      console.error(
        `Error fetching products (retries left: ${retries - 1}):`,
        error,
      );

      if (retries > 1) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, 4 - retries) * 500;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        retries--;
        continue;
      }

      // Use fallback data as the last resort
      const fallbackData = getAllFallbackProducts().map((product) => ({
        ...product,
        images: [
          {
            url: `/images/jewelry/${product.slug}.jpg`,
            altText: product.name,
          },
        ],
      }));
      console.log("Using fallback data due to persistent errors");

      return NextResponse.json(addAbsoluteUrlsToImages(fallbackData));
    }
  }
}
