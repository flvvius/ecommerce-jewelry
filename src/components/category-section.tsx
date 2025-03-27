import Link from "next/link"

export default function CategorySection() {
  const categories = [
    {
      name: "Necklaces",
      image: "/placeholder.svg?height=600&width=600",
      link: "/products/necklaces",
    },
    {
      name: "Rings",
      image: "/placeholder.svg?height=600&width=600",
      link: "/products/rings",
    },
    {
      name: "Earrings",
      image: "/placeholder.svg?height=600&width=600",
      link: "/products/earrings",
    },
    {
      name: "Bracelets",
      image: "/placeholder.svg?height=600&width=600",
      link: "/products/bracelets",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Shop by Category</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Explore our curated collections of fine jewelry
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 md:mt-12">
          {categories.map((category) => (
            <Link key={category.name} href={category.link} className="group relative overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10" />
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="aspect-square object-cover w-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-xl md:text-2xl font-medium text-white">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

