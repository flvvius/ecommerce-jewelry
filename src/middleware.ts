import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isWebhookRoute = createRouteMatcher(["/api/webhook/stripe(.*)"]);

// List of valid categories
const CATEGORIES = ["necklaces", "rings", "earrings", "bracelets"];

// Combine our middleware functionality
export default function middleware(request: NextRequest) {
  // First check if it's a category path that needs redirection
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/products/")) {
    const segments = pathname.split("/");
    if (segments.length > 2) {
      const potentialCategory = segments[2];

      if (potentialCategory && CATEGORIES.includes(potentialCategory)) {
        // Redirect to the query parameter version
        return NextResponse.redirect(
          new URL(`/products?category=${potentialCategory}`, request.url),
        );
      }
    }
  }

  // Then apply Clerk middleware for auth, but skip webhook routes
  if (isWebhookRoute(request)) {
    return NextResponse.next();
  }

  // For all other routes, apply Clerk middleware
  // @ts-ignore - Clerk types might be an issue here
  return clerkMiddleware()(request);
}

// Match all routes except the ones excluded
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
