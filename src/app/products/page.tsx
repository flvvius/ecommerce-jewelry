import Link from "next/link";
import { Filter } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import ProductGrid from "~/components/product-grid";
import ProductSidebar from "~/components/product-sidebar";
import MobileFilterDialog from "~/components/mobile-filter-dialog";

// Define interface for product type
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  slug: string;
  isNew?: boolean;
  isBestseller?: boolean;
  description?: string;
  material?: string | null;
}

// This is a Server Component
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    price?: string;
    material?: string;
    sort?: string;
  };
}) {
  // Fetch products from the API
  const params = await searchParams;
  const category = params.category;
  const price = params.price;
  const material = params.material;
  const sort = params.sort || "featured";

  // Format filter labels for display
  const formatPriceLabel = (priceParam: string) => {
    switch (priceParam) {
      case "under-500":
        return "Under $500";
      case "500-1000":
        return "$500 - $1000";
      case "1000-2000":
        return "$1000 - $2000";
      case "over-2000":
        return "Over $2000";
      default:
        return "";
    }
  };

  const formatMaterialLabel = (materialParam: string) => {
    return materialParam
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Create a new URLSearchParams without a specific filter
  const removeFilter = (filterType: string) => {
    const newParams = new URLSearchParams();

    if (category && filterType !== "category") {
      newParams.set("category", category);
    }

    if (price && filterType !== "price") {
      newParams.set("price", price);
    }

    if (material && filterType !== "material") {
      newParams.set("material", material);
    }

    return `/products${newParams.toString() ? `?${newParams.toString()}` : ""}`;
  };

  // Create a URL with updated sort parameter
  const createSortUrl = (sortValue: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("sort", sortValue);
    return `/products?${newParams.toString()}`;
  };

  // Get the current sort label for display
  const getSortLabel = () => {
    switch (sort) {
      case "price-low-high":
        return "Price: Low to High";
      case "price-high-low":
        return "Price: High to Low";
      case "newest":
        return "Newest";
      default:
        return "Featured";
    }
  };

  // Build query string manually - simpler approach
  let queryString = "";

  if (category)
    queryString += `${queryString ? "&" : ""}category=${encodeURIComponent(category)}`;
  if (price)
    queryString += `${queryString ? "&" : ""}price=${encodeURIComponent(price)}`;
  if (material)
    queryString += `${queryString ? "&" : ""}material=${encodeURIComponent(material)}`;
  if (sort)
    queryString += `${queryString ? "&" : ""}sort=${encodeURIComponent(sort)}`;

  // Create API endpoint URL without relying on URL object
  const baseApiPath = "/api/products";
  const fetchUrl = queryString ? `${baseApiPath}?${queryString}` : baseApiPath;

  console.log("Fetching products from:", fetchUrl);

  // Default empty array as fallback
  let products: Product[] = [];

  try {
    // Fix URL construction to handle when NEXT_PUBLIC_APP_URL already includes protocol
    let absoluteUrl;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (appUrl) {
      // If appUrl is already a complete URL, use it directly
      absoluteUrl = appUrl.includes("://")
        ? `${appUrl}${fetchUrl}`
        : `https://${appUrl}${fetchUrl}`;
    } else {
      // Fallback for local development
      absoluteUrl = `http://localhost:3000${fetchUrl}`;
    }

    console.log("Fetching from absolute URL:", absoluteUrl);

    const res = await fetch(absoluteUrl, { next: { revalidate: 60 } });

    if (!res.ok) {
      console.error("Error fetching products:", res.status, res.statusText);
      // Continue with empty products array
    } else {
      products = await res.json();
      console.log(`Successfully fetched ${products.length} products`);
    }
  } catch (error) {
    console.error("Error in ProductsPage:", error);
    // Continue with empty products array
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {category
              ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
              : "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {products.length > 0
              ? `${products.length} ${products.length === 1 ? "item" : "items"} found`
              : "Browse our collection of fine jewelry"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <MobileFilterDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort by: {getSortLabel()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={createSortUrl("featured")}
                  className="w-full cursor-pointer"
                >
                  Featured
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={createSortUrl("price-low-high")}
                  className="w-full cursor-pointer"
                >
                  Price: Low to High
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={createSortUrl("price-high-low")}
                  className="w-full cursor-pointer"
                >
                  Price: High to Low
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={createSortUrl("newest")}
                  className="w-full cursor-pointer"
                >
                  Newest
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <ProductSidebar className="hidden md:block" />
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {(category || price || material) && (
              <>
                {category && (
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    <Link href={removeFilter("category")}>
                      <button className="hover:bg-muted ml-1 rounded-full">
                        ✕
                      </button>
                    </Link>
                  </Badge>
                )}

                {price && (
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    {formatPriceLabel(price)}
                    <Link href={removeFilter("price")}>
                      <button className="hover:bg-muted ml-1 rounded-full">
                        ✕
                      </button>
                    </Link>
                  </Badge>
                )}

                {material && (
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    {formatMaterialLabel(material)}
                    <Link href={removeFilter("material")}>
                      <button className="hover:bg-muted ml-1 rounded-full">
                        ✕
                      </button>
                    </Link>
                  </Badge>
                )}

                <Link href="/products">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-primary h-7 px-3"
                  >
                    Clear all
                  </Button>
                </Link>
              </>
            )}
          </div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
