import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";
import { Toaster } from "~/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import ClientProviders from "~/components/client-providers";

export const metadata: Metadata = {
  title: "Lumina Jewelry",
  description: "Fine handcrafted jewelry for every occasion",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
        <head />
        <body className="flex min-h-screen flex-col">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ClientProviders>
              <Navbar />
              <main className="flex flex-1 items-center">
                <div className="mx-auto w-full max-w-screen-2xl py-8">
                  {children}
                </div>
              </main>
              <Footer />
            </ClientProviders>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
