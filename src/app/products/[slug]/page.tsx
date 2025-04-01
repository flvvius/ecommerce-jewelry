import React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import AddToCartButton from "~/components/add-to-cart-button";
import { notFound } from "next/navigation";
import ProductDetails from "~/components/product-details";

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
        <ProductDetails product={productData} />
      </Suspense>
    </div>
  );
}

// Helper function to fetch product data
async function fetchProduct(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/products/${slug}`,
    {
      next: { revalidate: 60 },
    },
  );

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
