import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isWebhookRoute = createRouteMatcher(["/api/webhook/stripe(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isWebhookRoute(req)) {
    return;
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
