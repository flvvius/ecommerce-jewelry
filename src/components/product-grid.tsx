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

type Product = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
  isBestseller?: boolean;
};

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [wishlist, setWishlist] = useState<(string | number)[]>([]);

  const toggleWishlist = (id: string | number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((productId) => productId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <Link href={`/products/${product.id}`} className="block">
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
                        onClick={(e) => {
                          e.preventDefault();
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
                    e.preventDefault();
                    e.stopPropagation();
                    // cart logic
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
          </Link>
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
  );
}
