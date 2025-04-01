import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { products, productImages } from "~/server/db/schema";
import { eq, and, SQL, between, lt, gte, sql, desc, asc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";
    const price = searchParams.get("price");
    const material = searchParams.get("material");
    const sort = searchParams.get("sort") || "featured";

    console.log("API request with params:", {
      category,
      featured,
      price,
      material,
      sort,
    });

    // Build conditions array
    const conditions: SQL<unknown>[] = [];

    if (category) {
      conditions.push(eq(products.category, category as any));
    }

    if (featured) {
      conditions.push(eq(products.isFeatured, true));
    }

    // Handle price ranges
    if (price) {
      switch (price) {
        case "under-500":
          conditions.push(lt(sql`${products.price}::numeric`, 500));
          break;
        case "500-1000":
          conditions.push(between(sql`${products.price}::numeric`, 500, 1000));
          break;
        case "1000-2000":
          conditions.push(between(sql`${products.price}::numeric`, 1000, 2000));
          break;
        case "over-2000":
          conditions.push(gte(sql`${products.price}::numeric`, 2000));
          break;
      }
    }

    // Handle material filter
    if (material) {
      console.log(`Filtering by material: '${material}'`);
      conditions.push(eq(products.material, material.replace("-", " ")));
    }

    // Determine order by clause based on sort parameter
    let result;
    const baseQuery = db
      .select({
        products: products,
        productImage: productImages,
      })
      .from(products)
      .leftJoin(
        productImages,
        and(
          eq(products.id, productImages.productId),
          eq(productImages.isDefault, true),
        ),
      )
      .where(conditions.length ? and(...conditions) : undefined);

    // Execute query with appropriate sorting
    if (sort === "price-low-high") {
      result = await baseQuery.orderBy(asc(sql`${products.price}::numeric`));
    } else if (sort === "price-high-low") {
      result = await baseQuery.orderBy(desc(sql`${products.price}::numeric`));
    } else if (sort === "newest") {
      result = await baseQuery.orderBy(desc(products.createdAt));
    } else {
      // Default is "featured" - featured products first, then newest
      result = await baseQuery.orderBy(
        desc(products.isFeatured),
        desc(products.createdAt),
      );
    }

    console.log("Query result count:", result.length);

    // Debug log for material values
    const debugProducts = await db
      .select({
        id: products.id,
        material: products.material,
      })
      .from(products);

    console.log("Current material values in DB:", debugProducts);

    // Transform the result to a more frontend-friendly format
    const formattedProducts = result.map(({ products, productImage }) => ({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: Number.parseFloat(products.price.toString()),
      category: products.category,
      material: products.material,
      isNew: products.isNew,
      isBestseller: products.isBestseller,
      isFeatured: products.isFeatured,
      image: productImage?.url || "/placeholder.svg?height=600&width=600",
      imageAlt: productImage?.altText || products.name,
      createdAt: products.createdAt,
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return an empty array instead of an error to prevent breaking the UI
    return NextResponse.json([]);
  }
}
