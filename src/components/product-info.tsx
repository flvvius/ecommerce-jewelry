"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag, Star, Truck } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    reviews: {
      average: number;
      count: number;
    };
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.reviews.average)
                    ? "fill-yellow-500 text-yellow-500"
                    : i < product.reviews.average
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted stroke-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">
            {product.reviews.average} ({product.reviews.count} reviews)
          </span>
        </div>
        <p className="mt-2 text-2xl font-bold">${product.price}</p>
      </div>

      <p className="text-muted-foreground">{product.description}</p>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-12 text-center">{quantity}</span>
            <Button variant="ghost" size="icon" onClick={increaseQuantity}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
          <Button className="flex-1" size="lg">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
          <Button variant="outline" size="icon" onClick={toggleWishlist}>
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Truck className="h-4 w-4" />
          <span>Free shipping on orders over $100</span>
        </div>
      </div>
    </>
  );
}
