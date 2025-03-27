"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";

export default function Navbar() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
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
          <ThemeToggle />
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
  );
}
