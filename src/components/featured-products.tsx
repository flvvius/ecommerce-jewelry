"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { toast } from "sonner";
import { useCart } from "~/context/cart-context";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew: boolean;
  isBestseller: boolean;
  slug: string;
};

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({
  products = [],
}: FeaturedProductsProps) {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { addItem } = useCart();

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((productId) => productId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      slug: product.slug,
    });

    toast(`${product.name} has been added to your cart.`, {
      duration: 3000,
    });
  };

  // Fallback for when products are empty or failed to load
  if (!products || products.length === 0) {
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
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <AlertCircle className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Products Coming Soon</h3>
            <p className="text-muted-foreground mb-6 max-w-md text-center">
              We're currently updating our featured collection. Please check
              back soon or browse our full catalog.
            </p>
            <Link href="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

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
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="bg-muted aspect-square overflow-hidden rounded-lg">
                <Link href={`/products/${product.slug}`}>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`}
                          />
                          <span className="sr-only">Add to wishlist</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add to wishlist</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
                {product.isNew && (
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    New
                  </Badge>
                )}
                {product.isBestseller && (
                  <Badge className="absolute top-3 left-3" variant="default">
                    Bestseller
                  </Badge>
                )}
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
