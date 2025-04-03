"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Truck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import AddToCartButton from "~/components/add-to-cart-button";

interface ProductDetailsProps {
  product: {
    id: number;
    name: string;
    price: number;
    description?: string;
    category: string;
    compareAtPrice?: number;
    images: Array<{
      url: string;
      altText?: string;
    }>;
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
      <div className="space-y-4">
        <div className="bg-muted aspect-square overflow-hidden rounded-lg">
          <Image
            src={product.images[selectedImageIndex]?.url || "/placeholder.svg"}
            alt={product.images[selectedImageIndex]?.altText || product.name}
            width={600}
            height={600}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {product.images && product.images.length > 0 ? (
            product.images.map(
              (image: { url: string; altText?: string }, index: number) => (
                <button
                  key={index}
                  className={`bg-muted aspect-square overflow-hidden rounded-md ${
                    index === selectedImageIndex ? "ring-primary ring-2" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.altText || `${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                </button>
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4
                      ? "fill-yellow-500 text-yellow-500"
                      : i < 4.5
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted stroke-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">
              4.5 (24 reviews)
            </span>
          </div>
          <div className="mt-2">
            {product.compareAtPrice ? (
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  $
                  {typeof product.price === "number"
                    ? product.price.toFixed(2)
                    : parseFloat(String(product.price)).toFixed(2)}
                </p>
                <p className="text-muted-foreground text-sm line-through">
                  $
                  {typeof product.compareAtPrice === "number"
                    ? product.compareAtPrice.toFixed(2)
                    : parseFloat(String(product.compareAtPrice)).toFixed(2)}
                </p>
                <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800">
                  Save $
                  {(
                    parseFloat(String(product.compareAtPrice)) -
                    parseFloat(String(product.price))
                  ).toFixed(2)}
                </span>
              </div>
            ) : (
              <p className="text-2xl font-bold">
                $
                {typeof product.price === "number"
                  ? product.price.toFixed(2)
                  : parseFloat(String(product.price)).toFixed(2)}
              </p>
            )}
          </div>
        </div>
        <p className="text-muted-foreground">
          {product.description || "No description available."}
        </p>

        <AddToCartButton product={product} />

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Truck className="h-4 w-4" />
          <span>Free shipping on orders over $100</span>
        </div>

        <Separator />

        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-4">
            <p className="text-muted-foreground">
              {product.description || "No description available."}
            </p>
          </TabsContent>
          <TabsContent value="details" className="pt-4">
            <ul className="text-muted-foreground list-disc space-y-1 pl-5">
              <li>
                Material:{" "}
                {product.category === "rings" ||
                product.category === "bracelets"
                  ? "18k Gold"
                  : "14k Gold"}
              </li>
              <li>Dimensions: Varies by size</li>
              <li>
                Weight: Approximately {(Math.random() * 0.5 + 0.1).toFixed(2)}oz
              </li>
              <li>Handcrafted with care</li>
              <li>Ethically sourced materials</li>
            </ul>
          </TabsContent>
          <TabsContent value="shipping" className="pt-4">
            <div className="text-muted-foreground space-y-4">
              <p>
                We offer free standard shipping on all orders over $100. For
                orders under $100, standard shipping is $9.95.
              </p>
              <p>
                Standard shipping takes 3-5 business days. Express shipping is
                available for an additional fee and takes 1-2 business days.
              </p>
              <p>
                International shipping is available to select countries. Please
                allow 7-14 business days for international orders.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
