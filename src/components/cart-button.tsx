"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useCart } from "~/context/cart-context"

export default function CartButton() {
  const { itemCount } = useCart()

  return (
    <Link href="/cart">
      <Button variant="outline" size="icon" className="relative">
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  )
}

