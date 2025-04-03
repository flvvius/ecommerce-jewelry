"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ShoppingBag, Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "~/context/cart-context";
import { getProductImageFallback } from "~/lib/image-utils";

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
    description?: string;
    slug: string;
    images?: { url: string }[];
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

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

    toast(
      isWishlisted
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
      {
        duration: 3000,
      },
    );
  };

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      // Determine the best image URL to use
      let imageUrl = product.images?.[0]?.url;

      // If no image provided, use the product slug to construct path
      if (!imageUrl && product.slug) {
        imageUrl = getProductImageFallback(product.slug);
      }

      await addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: parseFloat(
          typeof product.price === "string"
            ? product.price
            : product.price.toString(),
        ),
        image: imageUrl || "/placeholder.svg",
        quantity,
        description: product.description,
        slug: product.slug,
      });

      toast(`${quantity} × ${product.name} has been added to your cart.`, {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast("Failed to add item to cart. Please try again.", {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        <Button
          className="flex-1"
          size="lg"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
        <Button variant="outline" size="icon" onClick={toggleWishlist}>
          <Heart
            className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
          />
          <span className="sr-only">Add to wishlist</span>
        </Button>
      </div>
    </div>
  );
}
