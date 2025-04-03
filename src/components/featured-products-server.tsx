import FeaturedProducts from "./featured-products";

// This is a Server Component that fetches data and passes it to the client component
export default async function FeaturedProductsServer() {
  // Fetch featured products
  let products = [];

  try {
    // Get the base URL from env or use default - use the actual deployed URL in production
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/products`
      : `http://localhost:3000/api/products`;

    // Construct full URL with params
    const apiUrl = `${baseUrl}?featured=true`;

    console.log("Fetching featured products from:", apiUrl);

    // Fetch with proper error handling - using absolute URL
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 },
      headers: {
        // Add cache control headers to prevent stale responses
        "Cache-Control": "no-cache",
      },
    });

    if (!res.ok) {
      console.error(
        "Error fetching featured products:",
        res.status,
        res.statusText,
      );
      products = [];
    } else {
      products = await res.json();

      // Transform relative image URLs to absolute URLs if needed
      products = products.map((product: any) => {
        if (product.images && Array.isArray(product.images)) {
          const processedImages = product.images.map((image: any) => {
            if (image.url && image.url.startsWith("/")) {
              // Convert relative image URLs to absolute using NEXT_PUBLIC_APP_URL
              const baseImageUrl =
                process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
              return {
                ...image,
                url: `${baseImageUrl}${image.url}`,
              };
            }
            return image;
          });
          return { ...product, images: processedImages };
        }
        return product;
      });

      console.log(`Successfully fetched ${products.length} featured products`);
    }
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    products = [];
  }

  // Pass the fetched products to the client component
  return <FeaturedProducts products={products} />;
}
