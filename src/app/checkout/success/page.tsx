"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, ChevronRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) return

      try {
        // In a real app, you would fetch the order details from your backend
        // For demo purposes, we'll simulate a successful order
        setOrder({
          id: `ORD-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          total: "$2,797.00",
          items: [
            { name: "Diamond Pendant Necklace", price: "$1,299.00", quantity: 1 },
            { name: "Gold Hoop Earrings", price: "$499.00", quantity: 2 },
            { name: "Sapphire Tennis Bracelet", price: "$899.00", quantity: 1 },
          ],
          shipping: {
            name: "Jane Smith",
            address: "123 Main St, Apt 4B",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "United States",
          },
        })
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Lumina</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
              Shop All
            </Link>
            <Link href="/products/necklaces" className="text-sm font-medium transition-colors hover:text-primary">
              Necklaces
            </Link>
            <Link href="/products/rings" className="text-sm font-medium transition-colors hover:text-primary">
              Rings
            </Link>
            <Link href="/products/earrings" className="text-sm font-medium transition-colors hover:text-primary">
              Earrings
            </Link>
            <Link href="/products/bracelets" className="text-sm font-medium transition-colors hover:text-primary">
              Bracelets
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </Link>
            <Button className="hidden md:flex">Sign In</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8 md:py-12 max-w-3xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
            <p className="text-muted-foreground">Your order has been confirmed and will be shipped soon.</p>
          </div>

          <div className="border rounded-lg overflow-hidden mb-8">
            <div className="bg-muted/50 px-6 py-4 border-b">
              <h2 className="font-semibold">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-medium">Order Number</p>
                  <p className="text-muted-foreground">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Order Date</p>
                  <p className="text-muted-foreground">{order.date}</p>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Items</h3>
                <div className="space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <div className="flex gap-2">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground">x{item.quantity}</span>
                      </div>
                      <span>{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <address className="not-italic text-muted-foreground">
                  {order.shipping.name}
                  <br />
                  {order.shipping.address}
                  <br />
                  {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
                  <br />
                  {order.shipping.country}
                </address>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-center">
              A confirmation email has been sent to your email address.
            </p>
            <Link href="/products">
              <Button>
                Continue Shopping
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
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
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
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
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="text-muted-foreground hover:text-foreground transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/care" className="text-muted-foreground hover:text-foreground transition-colors">
                    Jewelry Care
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Stay Connected</h4>
              <p className="text-sm text-muted-foreground">
                Subscribe to our newsletter for exclusive offers and updates.
              </p>
              <form className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                />
                <Button type="submit" className="w-full">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2024 Lumina Jewelry. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

