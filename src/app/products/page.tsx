import { Filter, ShoppingBag, SlidersHorizontal } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import ProductGrid from "~/components/product-grid";

export default function ProductsPage() {
  const products = [
    {
      id: "1",
      name: "Diamond Pendant Necklace",
      price: 1299,
      image: "/placeholder.svg?height=600&width=600",
      category: "Necklaces",
      isNew: true,
      isBestseller: false,
    },
    {
      id: "2",
      name: "Gold Hoop Earrings",
      price: 499,
      image: "/placeholder.svg?height=600&width=600",
      category: "Earrings",
      isNew: false,
      isBestseller: true,
    },
    {
      id: "3",
      name: "Sapphire Tennis Bracelet",
      price: 899,
      image: "/placeholder.svg?height=600&width=600",
      category: "Bracelets",
      isNew: true,
      isBestseller: false,
    },
    {
      id: "4",
      name: "Emerald Cut Engagement Ring",
      price: 2499,
      image: "/placeholder.svg?height=600&width=600",
      category: "Rings",
      isNew: false,
      isBestseller: true,
    },
    {
      id: "5",
      name: "Pearl Drop Earrings",
      price: 349,
      image: "/placeholder.svg?height=600&width=600",
      category: "Earrings",
      isNew: false,
      isBestseller: false,
    },
    {
      id: "6",
      name: "Rose Gold Chain Bracelet",
      price: 599,
      image: "/placeholder.svg?height=600&width=600",
      category: "Bracelets",
      isNew: false,
      isBestseller: false,
    },
    {
      id: "7",
      name: "Vintage Inspired Necklace",
      price: 799,
      image: "/placeholder.svg?height=600&width=600",
      category: "Necklaces",
      isNew: false,
      isBestseller: false,
    },
    {
      id: "8",
      name: "Stacking Rings Set",
      price: 449,
      image: "/placeholder.svg?height=600&width=600",
      category: "Rings",
      isNew: true,
      isBestseller: false,
    },
  ];

  return (
    <>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground">
            Browse our collection of fine jewelry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="md:hidden">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort by: Featured
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Featured</DropdownMenuItem>
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
              <DropdownMenuItem>Newest</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="outline" className="rounded-full px-3 py-1">
          Gold
          <button className="hover:bg-muted ml-1 rounded-full">✕</button>
        </Badge>
        <Badge variant="outline" className="rounded-full px-3 py-1">
          Under $500
          <button className="hover:bg-muted ml-1 rounded-full">✕</button>
        </Badge>
        <Button variant="link" size="sm" className="text-primary h-7 px-3">
          Clear all
        </Button>
      </div>
      <ProductGrid products={products} />
    </>
  );
}
