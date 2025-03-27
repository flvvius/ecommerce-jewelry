import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { Button } from "~/components/ui/button";
import FeaturedProducts from "~/components/featured-products";
import HeroSection from "~/components/hero-section";
import CategorySection from "~/components/category-section";
import TestimonialSection from "~/components/testimonial-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Handcrafted with Love
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Each piece in our collection is meticulously handcrafted by
                skilled artisans using ethically sourced materials. We believe
                in creating jewelry that not only looks beautiful but also has a
                positive impact on the world.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/about">
                  <Button
                    variant="outline"
                    className="w-full min-[400px]:w-auto"
                  >
                    Our Story
                  </Button>
                </Link>
                <Link href="/products">
                  <Button className="w-full min-[400px]:w-auto">
                    Shop Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="aspect-video overflow-hidden rounded-xl">
              <img
                src="/placeholder.svg?height=720&width=1280"
                alt="Jewelry crafting process"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <TestimonialSection />
    </>
  );
}
