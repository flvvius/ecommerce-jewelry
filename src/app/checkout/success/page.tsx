"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setError("No session ID provided");
        setLoading(false);
        return;
      }

      // Development test mode for easier debugging
      if (sessionId === "cs_test_dev_mode") {
        console.log("Using test development mode");
        setOrder({
          id: "TEST-ORDER-12345",
          date: new Date().toLocaleDateString(),
          status: "processing",
          total: "$123.45",
          items: [
            {
              name: "Test Product 1",
              price: "$89.99",
              quantity: 1,
            },
            {
              name: "Test Product 2",
              price: "$33.46",
              quantity: 1,
            },
          ],
          shipping: {
            name: "Test Customer",
            address: "123 Test Street",
            city: "Test City",
            state: "TS",
            zip: "12345",
            country: "Testland",
          },
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching order details for session: ${sessionId}`);
        const response = await fetch(
          `/api/orders/checkout-session?session_id=${sessionId}`,
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API Error:", response.status, errorData);
          throw new Error(errorData.error || "Failed to fetch order details");
        }

        const data = await response.json();
        console.log("Order details received:", data);

        if (!data || Object.keys(data).length === 0) {
          throw new Error("No order data returned from the API");
        }

        setOrder(data);
      } catch (error: any) {
        console.error("Error fetching order details:", error);
        setError(error.message || "Failed to load order details");
        toast.error(
          "Failed to load order details. Please contact customer support.",
        );
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <CheckCircle2 className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Order Confirmed</h1>
          <p className="text-muted-foreground mb-4 max-w-md">
            Your order has been confirmed, but we couldn't load the detailed
            information. Error: {error}
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

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <CheckCircle2 className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Order Confirmed</h1>
          <p className="text-muted-foreground mb-4 max-w-md">
            Your order has been confirmed, but we couldn't load the details.
            Your items will be shipped soon.
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

  return (
    <div className="container flex min-h-screen items-center justify-center px-4 py-8 md:px-6 md:py-12">
      <div className="w-full max-w-3xl">
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
                <p className="text-muted-foreground">
                  {order?.id || "Processing"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">Order Date</p>
                <p className="text-muted-foreground">
                  {order?.date || new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <h3 className="mb-2 font-medium">Items</h3>
              <div className="space-y-2">
                {Array.isArray(order?.items) && order.items.length > 0 ? (
                  order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <div className="flex gap-2">
                        <span>{item?.name || "Product"}</span>
                        <span className="text-muted-foreground">
                          x{item?.quantity || 1}
                        </span>
                      </div>
                      <span>{item?.price || "$0.00"}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">
                    Your items are being processed
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <h3 className="mb-2 font-medium">Shipping Address</h3>
              <address className="text-muted-foreground not-italic">
                {order?.shipping?.name || "Customer"}
                <br />
                {order?.shipping?.address || "Address will be confirmed"}
                <br />
                {order?.shipping?.city ? `${order.shipping.city}, ` : ""}
                {order?.shipping?.state || ""} {order?.shipping?.zip || ""}
                <br />
                {order?.shipping?.country || ""}
              </address>
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{order?.total || "Processing"}</span>
              </div>
              <div className="text-muted-foreground mt-2 text-sm">
                <p>Status: {order?.status || "processing"}</p>
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
    </div>
  );
}
