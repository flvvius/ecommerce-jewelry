"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import CartButton from "~/components/cart-button";

export default function Navbar() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
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
            href="/products?category=necklaces"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            Necklaces
          </Link>
          <Link
            href="/products?category=rings"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            Rings
          </Link>
          <Link
            href="/products?category=earrings"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            Earrings
          </Link>
          <Link
            href="/products?category=bracelets"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            Bracelets
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <CartButton />
          <SignedIn>
            {/* User is signed in */}
            <Link
              href="/account"
              className="hover:text-primary mr-2 hidden text-sm font-medium transition-colors md:flex"
            >
              My Account
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            {/* User is signed out */}
            <SignInButton mode="modal">
              <Button className="hidden md:flex">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
