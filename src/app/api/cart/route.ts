import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { carts, cartItems, products, productImages } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Helper to get or create a cart
async function getOrCreateCart(sessionId: string) {
  // Check if cart exists
  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.sessionId, sessionId))
    .limit(1);

  if (cart.length === 0) {
    // Create a new cart
    const newCart = await db
      .insert(carts)
      .values({
        sessionId,
      })
      .returning();

    return newCart[0];
  }

  return cart[0];
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cartSessionId")?.value;

    if (!sessionId) {
      // Return empty cart if no session
      return NextResponse.json({ items: [], total: 0 });
    }

    const cart = await getOrCreateCart(sessionId);
    // Cart is guaranteed to exist here since getOrCreateCart always returns a cart

    // Get cart items with product details
    const cartItemsWithProducts = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        name: products.name,
        price: products.price,
        description: products.description,
        slug: products.slug,
        image: productImages.url,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(
        productImages,
        and(
          eq(products.id, productImages.productId),
          eq(productImages.isDefault, true),
        ),
      )
      .where(eq(cartItems.cartId, cart!.id));

    // Calculate total
    const total = cartItemsWithProducts.reduce(
      (sum, item) =>
        sum + Number.parseFloat(item.price.toString()) * item.quantity,
      0,
    );

    return NextResponse.json({
      items: cartItemsWithProducts.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
        price: Number.parseFloat(item.price.toString()),
        description: item.description || null,
        slug: item.slug,
        image: item.image || "/placeholder.svg?height=200&width=200",
      })),
      total,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { productId, quantity = 1 } = await request.json();

    const cookieStore = await cookies();
    let sessionId = cookieStore.get("cartSessionId")?.value;

    if (!sessionId) {
      sessionId = uuidv4();
      // Set cookie for 30 days
      cookieStore.set("cartSessionId", sessionId, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    const cart = await getOrCreateCart(sessionId);
    // Cart is guaranteed to exist here

    // Check if product exists
    const productExists = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (productExists.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if item already in cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.cartId, cart!.id), eq(cartItems.productId, productId)),
      )
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      const updatedItem = await db
        .update(cartItems)
        .set({
          quantity: existingItem[0]!.quantity + quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem[0]!.id))
        .returning();

      return NextResponse.json(updatedItem[0]);
    } else {
      // Add new item
      const newItem = await db
        .insert(cartItems)
        .values({
          cartId: cart!.id,
          productId,
          quantity,
        })
        .returning();

      return NextResponse.json(newItem[0]);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 },
    );
  }
}
