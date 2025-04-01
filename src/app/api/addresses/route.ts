import { db } from "~/server/db";
import { addresses } from "~/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Get all addresses for the current user
export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const userAddresses = await db.query.addresses.findMany({
      where: eq(addresses.clerkUserId, user.id),
      orderBy: [desc(addresses.isDefault), desc(addresses.id)],
    });

    return NextResponse.json(userAddresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    // Provide more specific error message based on error type
    const errorMessage =
      error instanceof Error
        ? `Failed to fetch addresses: ${error.message}`
        : "Failed to fetch addresses due to an unknown error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Create a new address for the current user
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

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
      isDefault = false,
    } = await request.json();

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
        { error: "Required fields are missing" },
        { status: 400 },
      );
    }

    // If this address is set as default, remove default status from other addresses
    if (isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.clerkUserId, user.id));
    }

    // Create new address
    const [newAddress] = await db
      .insert(addresses)
      .values({
        clerkUserId: user.id,
        firstName,
        lastName,
        address1,
        address2: address2 || null,
        city,
        state,
        postalCode,
        country,
        phone: phone || null,
        isDefault,
      })
      .returning();

    return NextResponse.json(newAddress);
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 },
    );
  }
}

// Update an address
export async function PUT(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const {
      id,
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault = false,
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 },
      );
    }

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
        { error: "Required fields are missing" },
        { status: 400 },
      );
    }

    // Check if address belongs to user
    const existingAddress = await db.query.addresses.findFirst({
      where: and(eq(addresses.id, id), eq(addresses.clerkUserId, user.id)),
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found or doesn't belong to this user" },
        { status: 404 },
      );
    }

    // If this address is set as default, remove default status from other addresses
    if (isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.clerkUserId, user.id));
    }

    // Update address
    const [updatedAddress] = await db
      .update(addresses)
      .set({
        firstName,
        lastName,
        address1,
        address2: address2 || null,
        city,
        state,
        postalCode,
        country,
        phone: phone || null,
        isDefault,
      })
      .where(and(eq(addresses.id, id), eq(addresses.clerkUserId, user.id)))
      .returning();

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 },
    );
  }
}

// Delete an address
export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("id");

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 },
      );
    }

    // Check if address belongs to user
    const existingAddress = await db.query.addresses.findFirst({
      where: and(
        eq(addresses.id, parseInt(addressId)),
        eq(addresses.clerkUserId, user.id),
      ),
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found or doesn't belong to this user" },
        { status: 404 },
      );
    }

    // If deleting the default address, make another address default
    if (existingAddress.isDefault) {
      const nextAddress = await db.query.addresses.findFirst({
        where: and(
          eq(addresses.clerkUserId, user.id),
          eq(addresses.id, parseInt(addressId), false),
        ),
        orderBy: [desc(addresses.id)],
      });

      if (nextAddress) {
        await db
          .update(addresses)
          .set({ isDefault: true })
          .where(eq(addresses.id, nextAddress.id));
      }
    }

    // Delete address
    await db
      .delete(addresses)
      .where(
        and(
          eq(addresses.id, parseInt(addressId)),
          eq(addresses.clerkUserId, user.id),
        ),
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 },
    );
  }
}
