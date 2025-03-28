"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Diamond Pendant Necklace",
      price: 1299,
      image: "/placeholder.svg?height=600&width=600",
      category: "Necklaces",
      isNew: true,
      isBestseller: false,
    },
    {
      id: 2,
      name: "Gold Hoop Earrings",
      price: 499,
      image: "/placeholder.svg?height=600&width=600",
      category: "Earrings",
      isNew: false,
      isBestseller: true,
    },
    {
      id: 3,
      name: "Sapphire Tennis Bracelet",
      price: 899,
      image: "/placeholder.svg?height=600&width=600",
      category: "Bracelets",
      isNew: true,
      isBestseller: false,
    },
    {
      id: 4,
      name: "Emerald Cut Engagement Ring",
      price: 2499,
      image: "/placeholder.svg?height=600&width=600",
      category: "Rings",
      isNew: false,
      isBestseller: true,
    },
    {
      id: 5,
      name: "Pearl Drop Earrings",
      price: 349,
      image: "/placeholder.svg?height=600&width=600",
      category: "Earrings",
      isNew: false,
      isBestseller: false,
    },
    {
      id: 6,
      name: "Rose Gold Chain Bracelet",
      price: 599,
      image: "/placeholder.svg?height=600&width=600",
      category: "Bracelets",
      isNew: false,
      isBestseller: false,
    },
    {
      id: 7,
      name: "Vintage Inspired Necklace",
      price: 799,
      image: "/placeholder.svg?height=600&width=600",
      category: "Necklaces",
      isNew: false,
      isBestseller: false,
    },
    {
      id: 8,
      name: "Stacking Rings Set",
      price: 449,
      image: "/placeholder.svg?height=600&width=600",
      category: "Rings",
      isNew: true,
      isBestseller: false,
    },
  ];

  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((productId) => productId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
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
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => toggleWishlist(product.id)}
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
                  <Button className="rounded-full">
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
                      href={`/products/${product.id}`}
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
