"use client";

import { type ReactNode } from "react";
import { CartProvider } from "~/context/cart-context";

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return <CartProvider>{children}</CartProvider>;
}
