import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { products, productImages } from "~/server/db/schema";
import { eq } from "drizzle-orm/expressions";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    console.log(`Fetching product with slug: ${params.slug}`);

    // Fetch the product by slug
    const result = await db
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
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(eq(products.slug, params.slug))
      .groupBy(products.id);

    if (!result.length) {
      console.log(`No product found with slug: ${params.slug}`);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = result[0];

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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    parsedImages = parsedImages.map((image: any) => {
      if (image.url && image.url.startsWith("/")) {
        return {
          ...image,
          url: `${baseUrl}${image.url}`,
        };
      }
      return image;
    });

    const productWithImages = {
      ...product,
      images: parsedImages,
    };

    return NextResponse.json(productWithImages);
  } catch (error) {
    console.error(`Error fetching product with slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
