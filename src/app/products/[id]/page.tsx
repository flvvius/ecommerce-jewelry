import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import ProductGallery from "~/components/product-gallery";
import ProductInfo from "~/components/product-info";
import ProductTabs from "~/components/product-tabs";

export default function ProductPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const product = {
    id,
    name: "Diamond Pendant Necklace",
    price: 1299,
    description:
      "This elegant diamond pendant necklace features a stunning 0.5 carat diamond set in 18k white gold. The pendant hangs from a delicate 18-inch chain, making it the perfect accessory for any occasion.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "Necklaces",
    features: [
      "0.5 carat diamond",
      "18k white gold",
      "18-inch chain",
      "Lobster clasp",
      "Comes with a luxury gift box",
    ],
    specifications: {
      Metal: "18k White Gold",
      "Diamond Weight": "0.5 carat",
      "Diamond Color": "G-H",
      "Diamond Clarity": "VS1-VS2",
      "Chain Length": "18 inches",
      "Clasp Type": "Lobster",
    },
    reviews: {
      average: 4.8,
      count: 124,
    },
  };

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="text-muted-foreground mb-6 flex items-center gap-1 text-sm">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/products"
          className="hover:text-foreground transition-colors"
        >
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/products/${product.category.toLowerCase()}`}
          className="hover:text-foreground transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="space-y-6">
          <ProductInfo product={product} />

          <Separator />

          <ProductTabs
            description={product.description}
            features={product.features}
            specifications={product.specifications}
          />
        </div>
      </div>
    </div>
  );
}
