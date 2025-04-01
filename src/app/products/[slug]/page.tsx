import React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import AddToCartButton from "~/components/add-to-cart-button";

// Define a more specific type for params
type PageParams = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: PageParams) {
  // We can access params.slug directly in server components
  const slug = params.slug;
  const productData = React.use(fetchProduct(slug));

  if (!productData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-muted-foreground mb-6 flex items-center gap-1 text-sm">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/products"
          className="hover:text-foreground transition-colors"
        >
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/products?category=${productData.category}`}
          className="hover:text-foreground transition-colors"
        >
          {productData.category.charAt(0).toUpperCase() +
            productData.category.slice(1)}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{productData.name}</span>
      </div>

      <Suspense fallback={<ProductLoading />}>
        <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="bg-muted aspect-square overflow-hidden rounded-lg">
              <img
                src={productData.images?.[0]?.url || "/placeholder.svg"}
                alt={productData.images?.[0]?.altText || productData.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productData.images && productData.images.length > 0 ? (
                productData.images.map(
                  (image: { url: string; altText?: string }, index: number) => (
                    <div
                      key={index}
                      className="bg-muted aspect-square overflow-hidden rounded-md"
                    >
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={
                          image.altText || `${productData.name} ${index + 1}`
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ),
                )
              ) : (
                <div className="bg-muted col-span-4 flex h-20 items-center justify-center rounded-md">
                  <p className="text-muted-foreground text-sm">
                    No additional images available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{productData.name}</h1>
              <p className="mt-2 text-2xl font-bold">${productData.price}</p>
            </div>

            <p className="text-muted-foreground">
              {productData.description || "No description available."}
            </p>

            <AddToCartButton product={productData} />

            <Separator />

            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4">
                <p className="text-muted-foreground">
                  {productData.description || "No description available."}
                </p>
              </TabsContent>
              <TabsContent value="details" className="pt-4">
                <ul className="text-muted-foreground list-disc space-y-1 pl-5">
                  <li>
                    Material:{" "}
                    {productData.category === "rings" ||
                    productData.category === "bracelets"
                      ? "18k Gold"
                      : "14k Gold"}
                  </li>
                  <li>Dimensions: Varies by size</li>
                  <li>Handcrafted with care</li>
                  <li>Ethically sourced materials</li>
                </ul>
              </TabsContent>
              <TabsContent value="shipping" className="pt-4">
                <div className="text-muted-foreground space-y-4">
                  <p>
                    We offer free standard shipping on all orders over $100.
                  </p>
                  <p>
                    Standard shipping takes 3-5 business days. Express shipping
                    is available.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Suspense>
    </div>
  );
}

// Helper function to fetch product data
async function fetchProduct(slug: string) {
  // For deployed environments, use relative URL path which automatically uses the correct host
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/products/${slug}`
    : `/api/products/${slug}`;

  const res = await fetch(apiUrl, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

// Loading state component
function ProductLoading() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <p>Loading product...</p>
      </div>
    </div>
  );
}
