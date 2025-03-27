"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Diamond Pendant Necklace",
      price: 1299,
      image: "/placeholder.svg?height=200&width=200",
      quantity: 1,
      description: "Elegant diamond pendant with 18k gold chain",
    },
    {
      id: 2,
      name: "Gold Hoop Earrings",
      price: 499,
      image: "/placeholder.svg?height=200&width=200",
      quantity: 2,
      description: "Classic 14k gold hoop earrings",
    },
    {
      id: 3,
      name: "Sapphire Tennis Bracelet",
      price: 899,
      image: "/placeholder.svg?height=200&width=200",
      quantity: 1,
      description: "Stunning sapphire tennis bracelet with white gold setting",
    },
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      if (!stripePromise) {
        toast.error("Stripe is not properly configured");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          metadata: {
            customerNote: "Standard shipping",
          },
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        toast.error("Checkout Error");
        return;
      }

      window.location.href = url;
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Checkout Error");
    } finally {
      setIsLoading(false);
    }
  };

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
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <Link
                      href={`/products/${item.id}`}
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
                  {isLoading ? "Processing..." : "Checkout"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
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
    </div>
  );
}
