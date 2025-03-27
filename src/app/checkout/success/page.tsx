"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) return;

      try {
        setOrder({
          id: `ORD-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          total: "$2,797.00",
          items: [
            {
              name: "Diamond Pendant Necklace",
              price: "$1,299.00",
              quantity: 1,
            },
            { name: "Gold Hoop Earrings", price: "$499.00", quantity: 2 },
            { name: "Sapphire Tennis Bracelet", price: "$899.00", quantity: 1 },
          ],
          shipping: {
            name: "Jane Smith",
            address: "123 Main St, Apt 4B",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "United States",
          },
        });
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle2 className="text-primary h-8 w-8" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Thank You for Your Order!</h1>
        <p className="text-muted-foreground">
          Your order has been confirmed and will be shipped soon.
        </p>
      </div>

      <div className="mb-8 overflow-hidden rounded-lg border">
        <div className="bg-muted/50 border-b px-6 py-4">
          <h2 className="font-semibold">Order Summary</h2>
        </div>
        <div className="p-6">
          <div className="mb-4 flex justify-between">
            <div>
              <p className="font-medium">Order Number</p>
              <p className="text-muted-foreground">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Order Date</p>
              <p className="text-muted-foreground">{order.date}</p>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="mb-2 font-medium">Items</h3>
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <div className="flex gap-2">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">
                      x{item.quantity}
                    </span>
                  </div>
                  <span>{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="mb-2 font-medium">Shipping Address</h3>
            <address className="text-muted-foreground not-italic">
              {order.shipping.name}
              <br />
              {order.shipping.address}
              <br />
              {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
              <br />
              {order.shipping.country}
            </address>
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{order.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-center">
          A confirmation email has been sent to your email address.
        </p>
        <Link href="/products">
          <Button>
            Continue Shopping
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
