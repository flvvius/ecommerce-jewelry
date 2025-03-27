"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"

export default function CheckoutButton({ cartItems }: { cartItems: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          success_url: `${window.location.origin}/checkout/success`,
          cancel_url: `${window.location.origin}/cart`,
        }),
      })

      const { id } = await response.json()

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      await stripe?.redirectToCheckout({ sessionId: id })
    } catch (error) {
      console.error("Error during checkout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? "Processing..." : "Checkout"}
    </Button>
  )
}

