import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { Button } from "~/components/ui/button";
import FeaturedProducts from "~/components/featured-products";
import HeroSection from "~/components/hero-section";
import CategorySection from "~/components/category-section";
import TestimonialSection from "~/components/testimonial-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Lumina</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/products"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Shop All
            </Link>
            <Link
              href="/products/necklaces"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Necklaces
            </Link>
            <Link
              href="/products/rings"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Rings
            </Link>
            <Link
              href="/products/earrings"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Earrings
            </Link>
            <Link
              href="/products/bracelets"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Bracelets
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px]">
                  3
                </span>
              </Button>
            </Link>
            <Button className="hidden md:flex">Sign In</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
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
                  in creating jewelry that not only looks beautiful but also has
                  a positive impact on the world.
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
      </main>
      <footer className="bg-muted/50 border-t">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/products"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/necklaces"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Necklaces
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/rings"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Rings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/earrings"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Earrings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/bracelets"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Bracelets
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/press"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/care"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Jewelry Care
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Stay Connected</h4>
              <p className="text-muted-foreground text-sm">
                Subscribe to our newsletter for exclusive offers and updates.
              </p>
              <form className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="border-input bg-background ring-offset-background h-10 rounded-md border px-3 py-2 text-sm"
                />
                <Button type="submit" className="w-full">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
            <p className="text-muted-foreground text-xs">
              © 2024 Lumina Jewelry. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
