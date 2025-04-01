"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import ProductSidebar from "./product-sidebar";

export default function MobileFilterDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Filter button */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center"
        onClick={() => setIsOpen(true)}
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        Filters & Sort
      </Button>

      {/* Filter overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-medium">Filters & Sort</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <ProductSidebar className="block" />
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <Button className="w-full" onClick={() => setIsOpen(false)}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
