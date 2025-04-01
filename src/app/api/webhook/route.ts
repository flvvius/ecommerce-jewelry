import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { db } from "~/server/db";
import { orders, carts, cartItems } from "~/server/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = (await headers()).get("stripe-signature") as string;

  let event;

  try {
    if (!sig || !endpointSecret) {
      console.error("Webhook signature or endpoint secret missing");
      // For development, allow events without signature verification
      if (process.env.NODE_ENV === "development" && !endpointSecret) {
        try {
          event = JSON.parse(body);
          console.log(
            "Running in development mode without signature verification",
          );
        } catch (err) {
          console.error("Invalid webhook payload received");
          return NextResponse.json(
            { error: "Invalid webhook payload" },
            { status: 400 },
          );
        }
      } else {
        return NextResponse.json(
          { error: "Webhook signature missing" },
          { status: 400 },
        );
      }
    } else {
      // Verify the signature if we have the secret
      try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        console.log(`Webhook verified: ${event.type}`);
      } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json(
          { error: `Webhook Error: ${err.message}` },
          { status: 400 },
        );
      }
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(
          `Processing checkout.session.completed for session: ${session.id}`,
        );

        try {
          // Update the order status in the database
          await db
            .update(orders)
            .set({
              status: "processing",
              updatedAt: new Date(),
            })
            .where(eq(orders.checkoutSessionId, session.id));

          console.log(`Updated order status for session ID: ${session.id}`);

          // Clear the cart if we have a session ID
          if (session.metadata?.cartSessionId) {
            console.log(
              `Clearing cart for session: ${session.metadata.cartSessionId}`,
            );
            const cart = await db
              .select()
              .from(carts)
              .where(eq(carts.sessionId, session.metadata.cartSessionId))
              .limit(1);

            if (cart.length > 0) {
              // Delete cart items first (due to foreign key constraint)
              await db
                .delete(cartItems)
                .where(eq(cartItems.cartId, cart[0]!.id));
              console.log(`Deleted cart items for cart ID: ${cart[0]!.id}`);

              // Then delete the cart
              await db.delete(carts).where(eq(carts.id, cart[0]!.id));
              console.log(`Deleted cart for ID: ${cart[0]!.id}`);
            } else {
              console.log(
                `No cart found for session ID: ${session.metadata.cartSessionId}`,
              );
            }
          }

          console.log(
            `Payment succeeded for order with session ID: ${session.id}`,
          );
        } catch (error) {
          console.error(`Error processing checkout session: ${error}`);
          // Continue processing - don't fail the webhook
        }
        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          `Processing payment_intent.succeeded for intent: ${paymentIntent.id}`,
        );

        try {
          // Update the order if we have a payment intent ID
          await db
            .update(orders)
            .set({
              status: "processing",
              updatedAt: new Date(),
            })
            .where(eq(orders.paymentIntentId, paymentIntent.id));

          console.log(
            `Updated order status for payment intent: ${paymentIntent.id}`,
          );
        } catch (error) {
          console.error(`Error processing payment intent: ${error}`);
          // Continue processing - don't fail the webhook
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Webhook general error: ${error}`);
    return NextResponse.json(
      { error: "Internal server error processing webhook" },
      { status: 500 },
    );
  }
}
