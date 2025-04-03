import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm/sql";
import { products, productImages } from "~/server/db/schema";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  try {
    console.log("Products API request URL:", request.url);

    // Initialize empty search params
    let searchParams = new URLSearchParams();

    // Extract query string from URL without using URL constructor
    const urlString = request.url;
    const queryIndex = urlString.indexOf("?");

    if (queryIndex !== -1) {
      // Get query string and parse it
      const queryString = urlString.substring(queryIndex + 1);
      searchParams = new URLSearchParams(queryString);
      console.log("Query params:", Object.fromEntries(searchParams.entries()));
    }

    // Get query parameters with safe fallbacks
    const category = searchParams.get("category");
    const price = searchParams.get("price");
    const material = searchParams.get("material");
    const sort = searchParams.get("sort") || "featured";
    const featured = searchParams.get("featured");

    // Build query
    let query = db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        category: products.category,
        material: products.material,
        description: products.description,
        slug: products.slug,
        isNew: products.isNew,
        isBestseller: products.isBestseller,
        isFeatured: products.isFeatured,
        createdAt: products.createdAt,
        image: productImages.url,
      })
      .from(products)
      .leftJoin(
        productImages,
        sql`${productImages.productId} = ${products.id}`,
      );

    // Apply filters
    if (category) {
      query = query.where(sql`${products.category} = ${category}`);
    }

    if (material) {
      // Convert hyphenated material value to space-separated in database
      // e.g., "rose-gold" in URL becomes "rose gold" in DB
      const formattedMaterial = material.replace(/-/g, " ");
      console.log("Searching for material:", formattedMaterial);
      query = query.where(sql`${products.material} = ${formattedMaterial}`);
    }

    if (featured === "true") {
      query = query.where(sql`${products.isFeatured} = true`);
    }

    if (price) {
      switch (price) {
        case "under-500":
          query = query.where(sql`${products.price}::numeric < 500`);
          break;
        case "500-1000":
          query = query.where(
            sql`${products.price}::numeric >= 500 AND ${products.price}::numeric <= 1000`,
          );
          break;
        case "1000-2000":
          query = query.where(
            sql`${products.price}::numeric >= 1000 AND ${products.price}::numeric <= 2000`,
          );
          break;
        case "over-2000":
          query = query.where(sql`${products.price}::numeric > 2000`);
          break;
      }
    }

    // Apply sorting
    const createdAtColumn = sql`${products.createdAt}`;
    const isFeaturedColumn = sql`${products.isFeatured}`;
    const priceColumn = sql`${products.price}::numeric`;

    switch (sort) {
      case "newest":
        query = query.orderBy(sql`${createdAtColumn} desc`);
        break;
      case "price-low-high":
        query = query.orderBy(sql`${priceColumn} asc`);
        break;
      case "price-high-low":
        query = query.orderBy(sql`${priceColumn} desc`);
        break;
      case "featured":
      default:
        query = query.orderBy(
          sql`${isFeaturedColumn} desc`,
          sql`${createdAtColumn} desc`,
        );
        break;
    }

    // Execute query
    const result = await query;

    // Map to correct structure
    // Note: This avoids issues with column name casing
    type ResultRow = (typeof result)[0];

    const products_data = result.map(
      ({
        id,
        name,
        price,
        category,
        material,
        description,
        slug,
        isNew,
        isBestseller,
        isFeatured,
        createdAt,
        image,
      }: ResultRow) => ({
        id,
        name,
        price,
        category,
        material,
        description,
        slug,
        isNew,
        isBestseller,
        isFeatured,
        createdAt,
        image,
      }),
    );

    return NextResponse.json(products_data);
  } catch (error) {
    console.error("Error in products API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
