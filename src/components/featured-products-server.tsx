import FeaturedProducts from "./featured-products";

// This is a Server Component that fetches data and passes it to the client component
export default async function FeaturedProductsServer() {
  // Fetch featured products
  let products = [];

  try {
    const baseApiPath = "/api/products";
    const queryString = "featured=true";

    // For Next.js server components, we need to use absolute URLs
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_APP_URL ||
          `https://${process.env.VERCEL_URL || "localhost:3000"}`;

    // Construct the full URL ensuring no double slashes
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanApiPath = baseApiPath.startsWith("/")
      ? baseApiPath
      : `/${baseApiPath}`;
    const absoluteUrl = `${cleanBaseUrl}${cleanApiPath}?${queryString}`;

    console.log("Fetching featured products with absolute URL:", absoluteUrl);

    // Fetch with proper error handling
    const res = await fetch(absoluteUrl, {
      next: { revalidate: 60 },
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
              // Convert relative image URLs to absolute using the same base URL
              return {
                ...image,
                url: `${cleanBaseUrl}${image.url}`,
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
