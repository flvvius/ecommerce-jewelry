import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { carts, orders, orderItems, addresses } from "~/server/db/schema";
import { eq, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import { products } from "~/server/db/schema";

// Define the CartItem type
type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  description?: string | null;
  image?: string;
};

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const body = await request.json();
    const items = body.items as CartItem[];
    const baseUrl = request.headers.get("host") || "";
    const shippingAddressId = body.metadata?.shippingAddressId;

    // More reliable way to determine origin
    const protocol = baseUrl.includes("localhost") ? "http" : "https";
    const origin = request.headers.get("origin") || `${protocol}://${baseUrl}`;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: { message: "No items to checkout" } },
        { status: 400 },
      );
    }

    // Log incoming data for debugging
    console.log(
      "Checkout request received with items:",
      JSON.stringify(items, null, 2),
    );

    // Fetch shipping address if provided
    let shippingAddress = null;
    if (shippingAddressId) {
      try {
        const addressResult = await db
          .select()
          .from(addresses)
          .where(eq(addresses.id, shippingAddressId))
          .limit(1);

        if (addressResult.length > 0) {
          shippingAddress = addressResult[0];
        }
      } catch (error) {
        console.error("Error fetching shipping address:", error);
      }
    }

    // First, verify that all product IDs exist in the database
    const productIds = items.map((item: any) => item.productId);
    console.log("Product IDs from cart:", productIds);

    const existingProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(inArray(products.id, productIds));

    console.log(
      "Found product IDs in database:",
      existingProducts.map((p) => p.id),
    );

    // Create a map of existing product IDs for quick lookup
    const validProductIds = new Set(existingProducts.map((p) => p.id));

    // Filter out items with invalid product IDs
    const validItems = items.filter((item: any) => {
      const isValid = validProductIds.has(item.productId);
      if (!isValid) {
        console.log(
          `Product ID ${item.productId} from item "${item.name}" not found in database`,
        );
      }
      return isValid;
    });

    console.log(
      `Found ${validItems.length} valid items out of ${items.length} total`,
    );

    if (validItems.length === 0) {
      return NextResponse.json(
        { error: { message: "No valid products in cart" } },
        { status: 400 },
      );
    }

    // Calculate cart totals first
    const subtotal = validItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.07; // 7% tax rate
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    // Prepare checkout session params
    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: validItems.map((item: any) => {
        // Prepare image URL for Stripe (must be absolute)
        let imageUrl = null;
        if (item.image && typeof item.image === "string") {
          // Check if it's an absolute URL already
          if (item.image.startsWith("http")) {
            imageUrl = item.image;
          }
          // Handle placeholder SVGs (we'll use a generic product image)
          else if (item.image.includes("placeholder.svg")) {
            imageUrl =
              "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=500&auto=format&fit=crop";
          }
          // Convert relative URLs to absolute
          else if (item.image.startsWith("/")) {
            imageUrl = `${origin}${item.image}`;
          }
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              ...(imageUrl ? { images: [imageUrl] } : {}),
              ...(item.description && item.description.trim() !== ""
                ? { description: item.description }
                : { description: `${item.name} - Fine Jewelry` }),
              metadata: {
                productId: item.productId,
              },
            },
            unit_amount: Math.round(item.price * 100), // Stripe uses cents
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        ...body.metadata,
        orderId: `ORD-${Date.now()}`,
        cartSessionId: body.cartSessionId,
      },
      // Minimal billing address collection
      billing_address_collection: "auto",
      // Do not collect shipping address in Stripe
      shipping_address_collection: undefined,
      // Note: To enable automatic tax calculation, uncomment the following:
      // automatic_tax: {
      //   enabled: true,
      // },
      // Add shipping options directly in Stripe
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Free Express Shipping",
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 2,
              },
              maximum: {
                unit: "business_day",
                value: 4,
              },
            },
          },
        },
      ],
    };

    // Add shipping address if available
    if (shippingAddress) {
      // Pass the shipping address through metadata since direct setting isn't available in types
      checkoutParams.metadata = {
        ...checkoutParams.metadata,
        shipping_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        shipping_address1: shippingAddress.address1,
        shipping_address2: shippingAddress.address2 || "",
        shipping_city: shippingAddress.city,
        shipping_state: shippingAddress.state,
        shipping_postal_code: shippingAddress.postalCode,
        shipping_country: shippingAddress.country,
        shipping_phone: shippingAddress.phone || "",
      };
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(checkoutParams);

    // Create a pending order in the database
    try {
      // Insert the order
      const [order] = await db
        .insert(orders)
        .values({
          status: "pending",
          subtotal: subtotal.toString(),
          tax: tax.toString(),
          shipping: shipping.toString(),
          total: total.toString(),
          checkoutSessionId: session.id,
          paymentIntentId: session.payment_intent as string,
          shippingAddressId: shippingAddressId
            ? parseInt(shippingAddressId)
            : undefined,
        })
        .returning();

      // Insert order items
      if (order) {
        await db.insert(orderItems).values(
          validItems.map((item: any) => ({
            orderId: order.id,
            productId: item.productId,
            name: item.name,
            price: item.price.toString(),
            quantity: item.quantity,
          })),
        );
        console.log(
          `Successfully created order #${order.id} with ${validItems.length} items`,
        );
      }
    } catch (dbError: any) {
      console.error("Database error when creating order:", dbError);
      // Still return the Stripe session even if order creation fails
      // The order can be created later when the webhook is received
    }

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      {
        error: {
          message: error.message || "Failed to create checkout session",
        },
      },
      { status: 500 },
    );
  }
}
