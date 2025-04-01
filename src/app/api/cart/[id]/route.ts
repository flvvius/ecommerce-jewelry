import { NextResponse } from "next/server"
import { db } from "~/server/db"
import { cartItems } from "~/server/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { quantity } = await request.json()
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid cart item ID" }, { status: 400 })
    }

    // Update the cart item
    const updatedItem = await db
      .update(cartItems)
      .set({
        quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, id))
      .returning()

    if (updatedItem.length === 0) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    return NextResponse.json(updatedItem[0])
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid cart item ID" }, { status: 400 })
    }

    // Delete the cart item
    await db.delete(cartItems).where(eq(cartItems.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing cart item:", error)
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
  }
}

