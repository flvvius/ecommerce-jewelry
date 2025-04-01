import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { products, productImages } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const routeParams = await params;
    const slug = routeParams.slug;

    const result = await db
      .select({
        products: products,
        product_images: productImages,
      })
      .from(products)
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(eq(products.slug, slug));

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get the product data
    const productData = result[0]?.products!;
    if (!productData) {
      return NextResponse.json(
        { error: "Product data incomplete" },
        { status: 500 },
      );
    }

    // Get all images for this product
    const allImages = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productData.id))
      .orderBy(productImages.sortOrder);

    // Format the product data
    const product = {
      id: productData.id,
      name: productData.name,
      slug: productData.slug,
      description: productData.description,
      price: Number.parseFloat(productData.price.toString()),
      compareAtPrice: productData.compareAtPrice
        ? Number.parseFloat(productData.compareAtPrice.toString())
        : null,
      category: productData.category,
      inventory: productData.inventory,
      isNew: productData.isNew,
      isBestseller: productData.isBestseller,
      images: allImages.map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText,
        isDefault: img.isDefault,
      })),
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
