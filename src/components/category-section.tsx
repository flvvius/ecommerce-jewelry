import Link from "next/link";
import Image from "next/image";

export default function CategorySection() {
  const categories = [
    {
      name: "Necklaces",
      image: "/images/category-necklaces.jpg",
      link: "/products?category=necklaces",
    },
    {
      name: "Rings",
      image: "/images/category-rings.jpg",
      link: "/products?category=rings",
    },
    {
      name: "Earrings",
      image: "/images/category-earrings.jpg",
      link: "/products?category=earrings",
    },
    {
      name: "Bracelets",
      image: "/images/category-bracelets.jpg",
      link: "/products?category=bracelets",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-screen-2xl py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed">
              Explore our curated collections of fine jewelry
            </p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:mt-12 md:grid-cols-4 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.link}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="absolute inset-0 z-10 bg-black/30 transition-colors group-hover:bg-black/40" />
              <Image
                src={category.image}
                alt={category.name}
                width={300}
                height={300}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <h3 className="text-xl font-medium text-white md:text-2xl">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
