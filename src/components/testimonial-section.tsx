"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "The quality of the jewelry is exceptional. I purchased a necklace for my anniversary and it exceeded all my expectations. The craftsmanship is impeccable and the packaging was beautiful.",
      product: "Diamond Pendant Necklace",
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "I bought an engagement ring and the entire experience was perfect. The customer service team helped me choose the perfect ring, and my fiancée absolutely loves it!",
      product: "Emerald Cut Engagement Ring",
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4,
      text: "The earrings I purchased are stunning and I receive compliments every time I wear them. The only reason for 4 stars instead of 5 is that shipping took a bit longer than expected.",
      product: "Gold Hoop Earrings",
    },
    {
      id: 4,
      name: "James Wilson",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "I've purchased multiple pieces from Lumina and have never been disappointed. The quality is consistent and the designs are timeless. Highly recommend!",
      product: "Sapphire Tennis Bracelet",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section className="mx-auto w-full max-w-screen-2xl py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed">
              Read testimonials from our satisfied customers
            </p>
          </div>
        </div>
        <div className="relative mt-12">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4 md:px-12"
                >
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground max-w-2xl text-lg italic">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="flex flex-col items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="mt-2">
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-muted-foreground text-sm">
                          on {testimonial.product}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous testimonial</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next testimonial</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
