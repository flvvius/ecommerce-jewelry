import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { addresses, orders } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      postalCode,
      country,
      phone,
      orderId,
      sessionId,
    } = body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !address1 ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      return NextResponse.json(
        { error: "All required address fields must be provided" },
        { status: 400 },
      );
    }

    // Get user from Clerk if authenticated
    const user = await currentUser();
    const userId = user?.id;

    // Create the address
    const [address] = await db
      .insert(addresses)
      .values({
        clerkUserId: userId || "guest", // Use "guest" for non-authenticated users
        firstName,
        lastName,
        address1,
        address2: address2 || null,
        city,
        state,
        postalCode,
        country,
        phone: phone || null,
        isDefault: false, // Guest checkout addresses are not default
      })
      .returning();

    // If there's an orderId, update the order with this shipping address
    if (orderId) {
      await db
        .update(orders)
        .set({
          shippingAddressId: address.id,
          billingAddressId: address.id, // Use same address for billing by default
        })
        .where(eq(orders.id, orderId));
    }

    // If there's a sessionId, update any order with this session ID
    if (sessionId) {
      await db
        .update(orders)
        .set({
          shippingAddressId: address.id,
          billingAddressId: address.id, // Use same address for billing by default
        })
        .where(eq(orders.checkoutSessionId, sessionId));
    }

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error: any) {
    console.error("Error creating shipping address:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create shipping address" },
      { status: 500 },
    );
  }
}
