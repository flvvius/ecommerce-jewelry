"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { X, ArrowDownAZ, ArrowUpZA } from "lucide-react";

interface ProductSidebarProps {
  className?: string;
}

export default function ProductSidebar({
  className = "",
}: ProductSidebarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get current filters from URL
  const currentCategory = searchParams.get("category");
  const currentPrice = searchParams.get("price");
  const currentMaterial = searchParams.get("material");
  const currentSort = searchParams.get("sort") || "featured";

  // Function to create URL with updated filters
  const createFilterUrl = (filterType: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) {
      params.delete(filterType);
    } else {
      params.set(filterType, value);
    }

    return `/products?${params.toString()}`;
  };

  // Handle price and material clicks
  const handleFilterClick = (filterType: string, value: string) => {
    const currentValue = searchParams.get(filterType);
    // Toggle filter if already active, otherwise set it
    const newValue = currentValue === value ? null : value;
    router.push(createFilterUrl(filterType, newValue));
  };

  // Handle sort selection
  const handleSortSelect = (value: string) => {
    router.push(createFilterUrl("sort", value));
  };

  // Check if any filters are applied
  const hasActiveFilters = currentCategory || currentPrice || currentMaterial;

  // Clear all filters
  const handleClearFilters = () => {
    router.push("/products");
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {hasActiveFilters && (
        <div className="bg-muted/50 rounded-lg border p-3">
          <h3 className="mb-2 text-sm font-medium">Active Filters</h3>
          <div className="space-y-1">
            {currentCategory && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Category:</span>
                <span className="text-sm font-semibold capitalize">
                  {currentCategory}
                </span>
              </div>
            )}
            {currentPrice && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Price:</span>
                <span className="text-sm font-semibold">
                  {currentPrice === "under-500"
                    ? "Under $500"
                    : currentPrice === "500-1000"
                      ? "$500 - $1000"
                      : currentPrice === "1000-2000"
                        ? "$1000 - $2000"
                        : "Over $2000"}
                </span>
              </div>
            )}
            {currentMaterial && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Material:</span>
                <span className="text-sm font-semibold capitalize">
                  {currentMaterial.replace("-", " ")}
                </span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-xs"
            onClick={handleClearFilters}
          >
            <X className="mr-1 h-3 w-3" /> Clear All
          </Button>
        </div>
      )}
      <div>
        <h3 className="mb-2 text-sm font-medium">Sort By</h3>
        <div className="space-y-1">
          <Button
            variant={currentSort === "featured" ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start font-normal"
            onClick={() => handleSortSelect("featured")}
          >
            Featured
          </Button>
          <Button
            variant={currentSort === "price-low-high" ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start font-normal"
            onClick={() => handleSortSelect("price-low-high")}
          >
            <ArrowDownAZ className="mr-2 h-3.5 w-3.5" />
            Price: Low to High
          </Button>
          <Button
            variant={currentSort === "price-high-low" ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start font-normal"
            onClick={() => handleSortSelect("price-high-low")}
          >
            <ArrowUpZA className="mr-2 h-3.5 w-3.5" />
            Price: High to Low
          </Button>
          <Button
            variant={currentSort === "newest" ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start font-normal"
            onClick={() => handleSortSelect("newest")}
          >
            Newest
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Categories</h3>
        <div className="space-y-1">
          <Link href="/products">
            <Button
              variant={!currentCategory ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
            >
              All Products
            </Button>
          </Link>
          <Link href={createFilterUrl("category", "necklaces")}>
            <Button
              variant={currentCategory === "necklaces" ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
            >
              Necklaces
            </Button>
          </Link>
          <Link href={createFilterUrl("category", "earrings")}>
            <Button
              variant={currentCategory === "earrings" ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
            >
              Earrings
            </Button>
          </Link>
          <Link href={createFilterUrl("category", "bracelets")}>
            <Button
              variant={currentCategory === "bracelets" ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
            >
              Bracelets
            </Button>
          </Link>
          <Link href={createFilterUrl("category", "rings")}>
            <Button
              variant={currentCategory === "rings" ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
            >
              Rings
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-medium">Price</h3>
        <div className="space-y-1">
          <Button
            variant={currentPrice === "under-500" ? "default" : "ghost"}
            className="w-full justify-start font-normal"
            onClick={() => handleFilterClick("price", "under-500")}
          >
            Under $500
          </Button>
          <Button
            variant={currentPrice === "500-1000" ? "default" : "ghost"}
            className="w-full justify-start font-normal"
            onClick={() => handleFilterClick("price", "500-1000")}
          >
            $500 - $1000
          </Button>
          <Button
            variant={currentPrice === "1000-2000" ? "default" : "ghost"}
            className="w-full justify-start font-normal"
            onClick={() => handleFilterClick("price", "1000-2000")}
          >
            $1000 - $2000
          </Button>
          <Button
            variant={currentPrice === "over-2000" ? "default" : "ghost"}
            className="w-full justify-start font-normal"
            onClick={() => handleFilterClick("price", "over-2000")}
          >
            Over $2000
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-medium">Material</h3>
        <div className="space-y-1">
          <Button
            variant={currentMaterial === "gold" ? "default" : "ghost"}
            className="w-full justify-start font-normal"
            onClick={() => handleFilterClick("material", "gold")}
          >
            <span className="mr-2 h-3 w-3 rounded-full bg-yellow-400"></span>
            Gold
          </Button>
          <Button
            variant={currentMaterial === "silver" ? "default" : "ghost"}
            className="w-full justify-start font-normal"
            onClick={() => handleFilterClick("material", "silver")}
          >
            <span className="mr-2 h-3 w-3 rounded-full bg-gray-300"></span>
            Silver
          </Button>
          <Button
            variant={currentMaterial === "rose-gold" ? "default" : "ghost"}
            className="w-full justify-start font-normal"
            onClick={() => handleFilterClick("material", "rose-gold")}
          >
            <span className="mr-2 h-3 w-3 rounded-full bg-rose-300"></span>
            Rose Gold
          </Button>
          <Button
            variant={currentMaterial === "platinum" ? "default" : "ghost"}
            className="w-full justify-start font-normal"
            onClick={() => handleFilterClick("material", "platinum")}
          >
            <span className="mr-2 h-3 w-3 rounded-full bg-gray-400"></span>
            Platinum
          </Button>
          <Button
            variant={
              currentMaterial === "gold and silver" ? "default" : "ghost"
            }
            className="w-full justify-start font-normal"
            onClick={() => handleFilterClick("material", "gold and silver")}
          >
            <div className="mr-2 flex h-3 w-3">
              <span className="h-3 w-1.5 rounded-l-full bg-yellow-400"></span>
              <span className="h-3 w-1.5 rounded-r-full bg-gray-300"></span>
            </div>
            Gold & Silver
          </Button>
        </div>
      </div>
    </div>
  );
}
