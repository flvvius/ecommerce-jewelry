"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Loader2,
  MapPin,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import CheckoutAddressForm from "~/components/checkout-address-form";
import type { ShippingAddressData } from "~/components/checkout-address-form";
import { useCart } from "~/context/cart-context";
import {
  getImageUrl,
  getProductImageFallback,
  getCompressedProductImage,
} from "~/lib/image-utils";

// Define the CartItem type to match your API response
type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  slug?: string;
};

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddressData | null>(null);
  const { isSignedIn } = useUser();

  // Use our updated cart context instead of managing separate state
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    isLoading: isCartLoading,
    subtotal,
  } = useCart();

  // Calculate shipping and total
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleAddressSubmit = async (address: ShippingAddressData) => {
    setShippingAddress(address);
    setIsAddressFormOpen(false);

    toast.success("Shipping address added", {
      description: `${address.address1}, ${address.city}, ${address.state} ${address.postalCode}`,
    });
  };

  const handleCheckout = async () => {
    // If no shipping address is set, show the form
    if (!shippingAddress) {
      setIsAddressFormOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      if (!stripePromise) {
        toast("Stripe is not properly configured");
        setIsLoading(false);
        return;
      }

      // Get the cart session ID from cookies (or generate a temporary one for local cart)
      let cartSessionId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("cartSessionId="))
        ?.split("=")[1];

      // If no cartSessionId, create a temporary one for local cart
      if (!cartSessionId) {
        cartSessionId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        document.cookie = `cartSessionId=${cartSessionId}; path=/; max-age=86400`;
      }

      // First, save the shipping address
      try {
        const addressResponse = await fetch("/api/shipping-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...shippingAddress,
            cartSessionId,
          }),
        });

        if (!addressResponse.ok) {
          const addressError = await addressResponse.json();
          throw new Error(
            addressError.error || "Failed to save shipping address",
          );
        }

        const { address } = await addressResponse.json();

        // Then create the checkout session
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems,
            cartSessionId,
            metadata: {
              customerNote: "Standard shipping",
              shippingAddressId: address.id,
            },
          }),
        });

        const { url, error } = await response.json();

        if (error) {
          toast(error.message || "Checkout Error");
          return;
        }

        window.location.href = url;
      } catch (addressError) {
        console.error("Error with address:", addressError);

        // If the address API fails, try direct checkout as fallback
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems,
            cartSessionId,
            metadata: {
              customerNote: "Standard shipping",
              // Include the address directly in the metadata
              shippingAddress: JSON.stringify(shippingAddress),
            },
          }),
        });

        const { url, error } = await response.json();

        if (error) {
          toast(error.message || "Checkout Error");
          return;
        }

        window.location.href = url;
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast("Checkout Error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isCartLoading) {
    return (
      <div className="container flex items-center justify-center px-4 py-20 md:px-6">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-10 w-10 animate-pulse text-gray-400" />
          <p className="mt-4 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="mb-8 flex items-center gap-2">
        <Link href="/products">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="py-12 text-center">
          <div className="bg-muted mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <ShoppingBag className="text-muted-foreground h-8 w-8" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/products">
            <Button>
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 py-4">
                <div className="bg-muted h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                  <Link href={`/products/${item.slug}`}>
                    <Image
                      src={
                        item.image ||
                        (item.slug
                          ? getProductImageFallback(item.slug)
                          : getImageUrl("/placeholder.svg"))
                      }
                      alt={item.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-md object-cover"
                      onError={(e) => {
                        // Try compressed version first
                        const imgElement = e.currentTarget as HTMLImageElement;
                        if (
                          item.slug &&
                          !imgElement.src.includes("compressed")
                        ) {
                          imgElement.src = getCompressedProductImage(item.slug);
                        } else if (
                          imgElement.src.includes("compressed") ||
                          !item.slug
                        ) {
                          // If compressed version fails or no slug, use placeholder
                          imgElement.src = getImageUrl("/placeholder.svg");
                        }
                      }}
                    />
                  </Link>
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <Link
                      href={`/products/${item.slug || item.id}`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="font-medium">${item.price}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-md border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="bg-muted/50 sticky top-24 rounded-lg p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Taxes calculated at checkout
                </p>
              </div>

              {/* Shipping Address Section */}
              <div className="mt-4 space-y-4">
                <Separator />

                <div className="space-y-2">
                  <h3 className="font-medium">Shipping Address</h3>

                  {shippingAddress ? (
                    <div className="text-muted-foreground rounded-md border p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p>
                            {shippingAddress.firstName}{" "}
                            {shippingAddress.lastName}
                          </p>
                          <p>{shippingAddress.address1}</p>
                          {shippingAddress.address2 && (
                            <p>{shippingAddress.address2}</p>
                          )}
                          <p>
                            {shippingAddress.city}, {shippingAddress.state}{" "}
                            {shippingAddress.postalCode}
                          </p>
                          <p>{shippingAddress.country}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddressFormOpen(true)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setIsAddressFormOpen(true)}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Add Shipping Address
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Discount code" className="flex-1" />
                  <Button variant="outline">Apply</Button>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading || cartItems.length === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : shippingAddress ? (
                    "Proceed to Payment"
                  ) : (
                    "Add Shipping Address"
                  )}
                </Button>

                {process.env.NODE_ENV === "development" && (
                  <Link
                    href="/checkout/success?session_id=cs_test_dev_mode"
                    className="mt-2 block"
                  >
                    <Button variant="outline" className="w-full">
                      Test Success Page
                    </Button>
                  </Link>
                )}
              </div>
              <div className="mt-6">
                <p className="text-muted-foreground text-center text-xs">
                  We accept all major credit cards, PayPal, and Apple Pay
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Address Form Dialog */}
      <CheckoutAddressForm
        isOpen={isAddressFormOpen}
        onClose={() => setIsAddressFormOpen(false)}
        onSubmit={handleAddressSubmit}
      />
    </div>
  );
}
