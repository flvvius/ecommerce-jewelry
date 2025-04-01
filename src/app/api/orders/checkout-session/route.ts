import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "~/server/db";
import { orders, orderItems, addresses, products } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    // Special handling for development test mode
    if (
      sessionId === "cs_test_dev_mode" &&
      process.env.NODE_ENV === "development"
    ) {
      console.log("Using test development mode data");
      return NextResponse.json({
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
    }

    console.log(`Fetching order details for session: ${sessionId}`);

    // Try to fetch the order with a safer approach instead of using relations
    let orderData;
    let orderItemsList = [];

    try {
      // First, get the order
      const orderResult = await db
        .select()
        .from(orders)
        .where(eq(orders.checkoutSessionId, sessionId))
        .limit(1);

      if (orderResult.length > 0) {
        orderData = orderResult[0];

        // Then get the order items separately
        orderItemsList = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, orderData.id));

        console.log(
          `Found order ${orderData.id} with ${orderItemsList.length} items`,
        );
      }
    } catch (dbError) {
      console.error("Error fetching order from database:", dbError);
      // Continue to Stripe fallback
    }

    // If order found in database
    if (orderData) {
      // Get shipping address if available
      let shippingAddress = null;
      if (orderData.shippingAddressId) {
        try {
          const addressResult = await db
            .select()
            .from(addresses)
            .where(eq(addresses.id, orderData.shippingAddressId))
            .limit(1);

          if (addressResult.length > 0) {
            shippingAddress = addressResult[0];
          }
        } catch (addressError) {
          console.error("Error fetching shipping address:", addressError);
        }
      }

      // Format response
      return NextResponse.json({
        id: `ORD-${orderData.id}`,
        date:
          orderData.createdAt?.toLocaleDateString() ||
          new Date().toLocaleDateString(),
        total: `$${parseFloat(orderData.total?.toString() || "0").toFixed(2)}`,
        status: orderData.status || "processing",
        items: orderItemsList.map((item) => ({
          name: item.name || "Product",
          price: `$${parseFloat(item.price?.toString() || "0").toFixed(2)}`,
          quantity: item.quantity || 1,
        })),
        shipping: shippingAddress
          ? {
              name:
                `${shippingAddress.firstName || ""} ${shippingAddress.lastName || ""}`.trim() ||
                "Customer",
              address:
                (shippingAddress.address1 || "") +
                (shippingAddress.address2
                  ? `, ${shippingAddress.address2}`
                  : ""),
              city: shippingAddress.city || "",
              state: shippingAddress.state || "",
              zip: shippingAddress.postalCode || "",
              country: shippingAddress.country || "",
            }
          : {
              // Fallback if no shipping address is available
              name: "Customer",
              address: "Address not available",
              city: "",
              state: "",
              zip: "",
              country: "",
            },
      });
    }

    // If not found in our database, try to get it from Stripe
    try {
      console.log("Attempting to retrieve session from Stripe");
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: [
          "line_items",
          "line_items.data.price.product",
          "customer_details",
        ],
      });

      if (!session) {
        console.log("No session found in Stripe");
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      console.log("Session retrieved from Stripe successfully");

      // Format Stripe data into our response format
      const items =
        session.line_items?.data.map((item) => ({
          name: item.description || "Product",
          price: `$${((item.amount_total ?? 0) / 100).toFixed(2)}`,
          quantity: item.quantity || 1,
        })) || [];

      // Get customer details from Stripe with safer access
      const customerDetails = session.customer_details || {};
      const address = customerDetails.address || {};

      return NextResponse.json({
        id: session.metadata?.orderId || `ORD-${Date.now()}`,
        date: new Date(session.created * 1000).toLocaleDateString(),
        total: `$${((session.amount_total ?? 0) / 100).toFixed(2)}`,
        status: session.payment_status || "processing",
        items,
        shipping: {
          name: customerDetails.name || "Customer",
          address: address.line1 || "Address not available",
          city: address.city || "",
          state: address.state || "",
          zip: address.postal_code || "",
          country: address.country || "",
        },
      });
    } catch (stripeError) {
      console.error("Error retrieving Stripe session:", stripeError);

      // Return a fallback order with minimal information for the UI
      return NextResponse.json({
        id: `ORD-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        total: "Processing",
        status: "processing",
        items: [],
        shipping: {
          name: "Customer",
          address: "Processing",
          city: "",
          state: "",
          zip: "",
          country: "",
        },
      });
    }
  } catch (error: any) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch order details",
        id: `ORD-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        total: "Processing",
        status: "processing",
        items: [],
        shipping: {
          name: "Customer",
          address: "Processing",
          city: "",
          state: "",
          zip: "",
          country: "",
        },
      },
      { status: 200 }, // Return 200 with fallback data instead of error
    );
  }
}
