"use client";

import React from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="container flex h-[70vh] flex-col items-center justify-center px-4 py-16 text-center md:px-6">
      <h1 className="mb-4 text-4xl font-bold">Product Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We couldn't find the product you're looking for. It may have been
        removed, renamed, or doesn't exist.
      </p>
      <div className="flex gap-4">
        <Link href="/products">
          <Button>View All Products</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
