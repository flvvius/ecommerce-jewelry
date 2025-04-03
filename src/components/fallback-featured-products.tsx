"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";

// A simple fallback component that doesn't rely on data fetching
export default function FallbackFeaturedProducts() {
  // Static data for fallback
  const fallbackProducts = [
    {
      id: 1,
      name: "Diamond Pendant Necklace",
      price: 1299,
      image: "/images/jewelry/diamond-pendant-necklace.jpg",
      category: "necklaces",
      slug: "diamond-pendant-necklace",
    },
    {
      id: 2,
      name: "Gold Hoop Earrings",
      price: 499,
      image: "/images/jewelry/gold-hoop-earrings.jpg",
      category: "earrings",
      slug: "gold-hoop-earrings",
    },
    {
      id: 3,
      name: "Sapphire Tennis Bracelet",
      price: 899,
      image: "/images/jewelry/sapphire-tennis-bracelet.jpg",
      category: "bracelets",
      slug: "sapphire-tennis-bracelet",
    },
    {
      id: 4,
      name: "Emerald Cut Engagement Ring",
      price: 2499,
      image: "/images/jewelry/emerald-cut-engagement-ring.jpg",
      category: "rings",
      slug: "emerald-cut-engagement-ring",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-screen-2xl py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Featured Collection
            </h2>
            <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed">
              Discover our most popular and newest pieces
            </p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-12 md:grid-cols-3 lg:grid-cols-4">
          {fallbackProducts.map((product, index) => (
            <div key={product.id} className="group relative">
              <div className="bg-muted aspect-square overflow-hidden rounded-lg">
                <Link href={`/products/${product.slug}`}>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={index < 4}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Link>
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm font-medium">
                    <Link
                      href={`/products/${product.slug}`}
                      className="hover:underline"
                    >
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    {product.category}
                  </p>
                </div>
                <p className="text-sm font-medium">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="/products">
            <Button variant="outline" className="rounded-full px-8">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
