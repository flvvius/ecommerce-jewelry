"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"

type Product = {
  id: string | number
  name: string
  price: number
  image: string
  category?: string
  isNew?: boolean
  isBestseller?: boolean
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [wishlist, setWishlist] = useState<(string | number)[]>([])

  const toggleWishlist = (id: string | number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((productId) => productId !== id))
    } else {
      setWishlist([...wishlist, id])
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`}
                      />
                      <span className="sr-only">Add to wishlist</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to wishlist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pb-4">
              <Button className="rounded-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
            {product.isNew && (
              <Badge className="absolute top-3 left-3" variant="secondary">
                New
              </Badge>
            )}
            {product.isBestseller && (
              <Badge className="absolute top-3 left-3" variant="default">
                Bestseller
              </Badge>
            )}
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm font-medium">
                <Link href={`/products/${product.id}`} className="hover:underline">
                  {product.name}
                </Link>
              </h3>
              <p className="text-xs text-muted-foreground">{product.category}</p>
            </div>
            <p className="text-sm font-medium">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

