import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gift } from "lucide-react";
import { Suspense } from "react";
import dynamic from "next/dynamic";

import { Button } from "~/components/ui/button";
import FallbackFeaturedProducts from "~/components/fallback-featured-products";
import HeroSection from "~/components/hero-section";
import CategorySection from "~/components/category-section";
import TestimonialSection from "~/components/testimonial-section";
// import { db } from "~/server/db";

// Dynamically import the FeaturedProductsServer component with a fallback
const FeaturedProductsServer = dynamic(
  () => import("~/components/featured-products-server"),
  {
    loading: () => <FallbackFeaturedProducts />,
    ssr: true,
  },
);

export default function Home() {
  // const posts = await db.query.products.findMany();
  // console.log(posts);

  return (
    <>
      <HeroSection />
      <CategorySection />

      {/* Use Suspense as a safety net for data fetching */}
      <Suspense fallback={<FallbackFeaturedProducts />}>
        <FeaturedProductsServer />
      </Suspense>

      {/* Gift Ideas Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <div className="mb-3 flex justify-center">
              <Gift className="text-primary h-10 w-10" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Gift Ideas
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl md:text-xl">
              Thoughtful jewelry gifts for every occasion
            </p>
          </div>
          <div className="from-primary/10 to-secondary/10 relative mx-auto mb-10 max-w-3xl overflow-hidden rounded-xl bg-gradient-to-r p-8 md:p-12">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Find the Perfect Gift</h3>
                <p className="text-muted-foreground">
                  Explore our curated gift selections for anniversaries,
                  birthdays, weddings, and more. Let us help you find a gift
                  they'll cherish forever.
                </p>
                <Link href="/gift-guide">
                  <Button size="lg" className="mt-2">
                    View Gift Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="hidden items-center justify-center md:flex">
                <div className="bg-primary/20 relative h-40 w-40 rounded-full p-2">
                  <Image
                    src="/images/jewelry/diamond-pendant-necklace.jpg"
                    alt="Gift idea"
                    className="rounded-full object-cover"
                    fill
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-24" style={{ opacity: 0.5 }}>
        <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
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
              <Image
                src="/images/handcrafted.jpg"
                alt="Jewelry crafting process"
                width={1280}
                height={720}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Exquisite Craftsmanship
            </h2>
            <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Each piece of jewelry is handcrafted with precision and care,
              ensuring exceptional quality and unique character.
            </p>
          </div>
        </div>
      </section>
      <TestimonialSection />
    </>
  );
}
