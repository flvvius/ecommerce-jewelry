import React from "react";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import AddToCartButton from "~/components/add-to-cart-button";
import ProductGallery from "~/components/product-gallery";

// Define a more specific type for params
type PageParams = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: PageParams) {
  // We need to await params before using its properties
  const slug = params.slug;

  try {
    const productData = await fetchProduct(slug);

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
            <ProductGallery
              images={productData.images || []}
              productName={productData.name}
              slug={productData.slug}
            />

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
                      Standard shipping takes 3-5 business days. Express
                      shipping is available.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    return <ProductLoading error="Failed to load product details" />;
  }
}

// Helper function to fetch product data
async function fetchProduct(slug: string) {
  const baseApiPath = `/api/products/${slug}`;

  try {
    // For Next.js server components, we need to use absolute URLs
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_APP_URL ||
          `https://${process.env.VERCEL_URL || "localhost:3000"}`;

    // Construct the full URL ensuring no double slashes
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanApiPath = baseApiPath.startsWith("/")
      ? baseApiPath
      : `/${baseApiPath}`;
    const absoluteUrl = `${cleanBaseUrl}${cleanApiPath}`;

    console.log("Fetching product with absolute URL:", absoluteUrl);

    const res = await fetch(absoluteUrl, { next: { revalidate: 60 } });

    if (!res.ok) {
      console.error(`Error fetching product: ${res.status} ${res.statusText}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error in fetchProduct:", error);
    return null;
  }
}

// Update the loading component to handle errors
function ProductLoading({ error }: { error?: string } = {}) {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="mb-2 text-red-500">{error}</div>
        ) : (
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
        )}
        <p>{error ? "Please try again later" : "Loading product..."}</p>
      </div>
    </div>
  );
}
