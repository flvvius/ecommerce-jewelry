"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "/placeholder.svg?height=1080&width=1920",
      title: "Timeless Elegance",
      description: "Discover our new collection of handcrafted jewelry pieces",
      cta: "Shop Now",
      link: "/products",
    },
    {
      image: "/placeholder.svg?height=1080&width=1920",
      title: "Summer Essentials",
      description: "Lightweight pieces perfect for the season",
      cta: "Explore Collection",
      link: "/products/summer",
    },
    {
      image: "/placeholder.svg?height=1080&width=1920",
      title: "Gift Ideas",
      description: "Thoughtful jewelry gifts for every occasion",
      cta: "Find the Perfect Gift",
      link: "/gift-guide",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div className="absolute inset-0 z-10 bg-black/40" />
          <img
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container mx-auto max-w-screen-xl px-4 text-center md:px-6">
              <div className="mx-auto max-w-2xl space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
                  {slide.title}
                </h1>
                <p className="text-xl text-white/90 md:text-2xl">
                  {slide.description}
                </p>
                <div className="pt-4">
                  <Link href={slide.link}>
                    <Button size="lg" className="rounded-full px-8">
                      {slide.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute right-0 bottom-6 left-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
