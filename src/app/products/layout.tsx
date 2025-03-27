import ProductSidebar from "~/components/product-sidebar";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <ProductSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}
