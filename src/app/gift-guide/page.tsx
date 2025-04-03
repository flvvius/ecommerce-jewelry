import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift, Heart, Sparkles, Gem } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export const metadata = {
  title: "Gift Guide - Lumina Jewelry",
  description: "Find the perfect jewelry gift for every occasion and recipient",
};

export default function GiftGuidePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Gift Guide</h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl">
          Finding the perfect gift can be challenging. Our curated gift guide
          makes it easy to find thoughtful jewelry pieces for every special
          occasion and person in your life.
        </p>
      </div>

      {/* Gifts by Occasion */}
      <section className="mb-16">
        <div className="mb-8 flex items-center">
          <Gift className="mr-2 h-6 w-6" />
          <h2 className="text-2xl font-bold">Shop by Occasion</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <OccasionCard
            title="Anniversary"
            description="Celebrate your love with timeless pieces"
            image="/images/category-rings.jpg"
            link="/products?category=rings"
          />
          <OccasionCard
            title="Birthday"
            description="Make their special day unforgettable"
            image="/images/category-earrings.jpg"
            link="/products?category=earrings"
          />
          <OccasionCard
            title="Wedding"
            description="Perfect pieces for the big day"
            image="/images/category-necklaces.jpg"
            link="/products?category=necklaces"
          />
          <OccasionCard
            title="Graduation"
            description="Celebrate achievements with elegance"
            image="/images/category-bracelets.jpg"
            link="/products?category=bracelets"
          />
        </div>
      </section>

      {/* Featured Gift Sets */}
      <section className="mb-16">
        <div className="mb-8 flex items-center">
          <Sparkles className="mr-2 h-6 w-6" />
          <h2 className="text-2xl font-bold">Featured Gift Sets</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
            <div className="relative h-64 w-full">
              <Image
                src="/images/hero-1.jpg"
                alt="Luxury Gift Set"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold">Luxury Gift Set</h3>
              <p className="text-muted-foreground mb-4">
                Our most popular combination for special occasions. Includes a
                matching necklace and earrings set crafted with the finest
                materials.
              </p>
              <Link href="/products?sort=price-high-low">
                <Button>
                  Shop Luxury Sets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
            <div className="relative h-64 w-full">
              <Image
                src="/images/hero-2.jpg"
                alt="Essential Jewelry Set"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold">Essential Jewelry Set</h3>
              <p className="text-muted-foreground mb-4">
                Perfect for everyday elegance. This set includes versatile
                pieces that can be mixed and matched for any occasion.
              </p>
              <Link href="/products?sort=featured">
                <Button>
                  Shop Essential Sets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gifts by Budget */}
      <section className="mb-16">
        <div className="mb-8 flex items-center">
          <Gem className="mr-2 h-6 w-6" />
          <h2 className="text-2xl font-bold">Shop by Budget</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Link
            href="/products?price=under-500"
            className="bg-card hover:bg-accent flex h-24 items-center justify-center rounded-lg border p-6 shadow-sm transition-colors"
          >
            <span className="text-lg font-medium">Under $500</span>
          </Link>
          <Link
            href="/products?price=500-1000"
            className="bg-card hover:bg-accent flex h-24 items-center justify-center rounded-lg border p-6 shadow-sm transition-colors"
          >
            <span className="text-lg font-medium">$500 - $1,000</span>
          </Link>
          <Link
            href="/products?price=1000-2000"
            className="bg-card hover:bg-accent flex h-24 items-center justify-center rounded-lg border p-6 shadow-sm transition-colors"
          >
            <span className="text-lg font-medium">$1,000 - $2,000</span>
          </Link>
          <Link
            href="/products?price=over-2000"
            className="bg-card hover:bg-accent flex h-24 items-center justify-center rounded-lg border p-6 shadow-sm transition-colors"
          >
            <span className="text-lg font-medium">Over $2,000</span>
          </Link>
        </div>
      </section>

      {/* Gift Giving Tips */}
      <section className="bg-muted rounded-xl p-8">
        <div className="mb-6 flex items-center">
          <Heart className="mr-2 h-6 w-6" />
          <h2 className="text-2xl font-bold">Gift Giving Tips</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-2 text-lg font-medium">Consider Their Style</h3>
            <p className="text-muted-foreground">
              Take note of the jewelry they already wear. Do they prefer gold or
              silver? Minimalist or statement pieces? Match your gift to their
              personal style.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium">Occasion Matters</h3>
            <p className="text-muted-foreground">
              Different occasions call for different pieces. Anniversary gifts
              often symbolize your journey together, while graduation gifts
              represent achievement and new beginnings.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium">
              Include a Personal Note
            </h3>
            <p className="text-muted-foreground">
              A thoughtful message can make your gift even more special. We
              offer complimentary gift wrapping and personalized notes with
              every purchase.
            </p>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center">
          <p className="mb-6 text-lg">
            Need more guidance? Our jewelry experts are here to help you select
            the perfect gift.
          </p>
          <Link href="/products">
            <Button size="lg">
              Explore All Jewelry
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function OccasionCard({
  title,
  description,
  image,
  link,
}: {
  title: string;
  description: string;
  image: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="group bg-card overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
