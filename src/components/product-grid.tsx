"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"

export default function ProductGrid() {
  const products = [
    {
      id: 1,
      name: "Diamond Pendant Necklace",
      price: 1299,
      image: "/placeholder.svg?height=600&width=600",
      category: "Necklaces",
      isNew: true,
      isBestseller: false,
    },
    {
      id: 2,
      name: "Gold Hoop Earrings",
      price: 499,
      image: "/placeholder.svg?height=600&width=600",
      category: "Earrings",
      isNew: false,
      isBestseller: true,
    },
    {
      id: 3,
      name: "Sapphire Tennis Bracelet",
      price: 899,
      image: "/placeholder.svg?height=600&width=600",
      category: "Bracelets",
      isNew: true,
      isBestseller: false,
    },
    {
      id: 4,
      name: "Emerald Cut Engagement Ring",
      price: 2499,
      image: "/placeholder.svg?height=600&width=600",
      category: "Rings",
      isNew: false,
      isBestseller: true,
    },
    {
      id: 5,
      name: "Pearl Drop Earrings",
      price: 349,
      image: "/placeholder.svg?height=600&width=600",
      category: "Earrings",
      isNew: false,
      isBestseller: false,
    },
    {
      id: 6,
      name: "Rose Gold Chain Bracelet",
      price: 599,
      image: "/placeholder.svg?height=600&width=600",
      category: "Bracelets",
      isNew: false,
      isBestseller: false,
    },
    {
      id: 7,
      name: "Vintage Inspired Necklace",
      price: 799,
      image: "/placeholder.svg?height=600&width=600",
      category: "Necklaces",
      isNew: false,
      isBestseller: false,
    },
    {
      id: 8,
      name: "Stacking Rings Set",
      price: 449,
      image: "/placeholder.svg?height=600&width=600",
      category: "Rings",
      isNew: true,
      isBestseller: false,
    },
    {
      id: 9,
      name: "Silver Statement Earrings",
      price: 279,
      image: "/placeholder.svg?height=600&width=600",
      category: "Earrings",
      isNew: false,
      isBestseller: false,
    },
    {
      id: 10,
      name: "Minimalist Gold Necklace",
      price: 399,
      image: "/placeholder.svg?height=600&width=600",
      category: "Necklaces",
      isNew: false,
      isBestseller: false,
    },
    {
      id: 11,
      name: "Diamond Eternity Band",
      price: 1899,
      image: "/placeholder.svg?height=600&width=600",
      category: "Rings",
      isNew: false,
      isBestseller: false,
    },
    {
      id: 12,
      name: "Charm Bracelet",
      price: 349,
      image: "/placeholder.svg?height=600&width=600",
      category: "Bracelets",
      isNew: false,
      isBestseller: false,
    },
  ]

  const [wishlist, setWishlist] = useState<number[]>([])

  const toggleWishlist = (id: number) => {
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

