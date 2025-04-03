"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "sonner";

type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  productId: number;
  description?: string;
  slug?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to generate a unique ID for local storage cart items
const generateLocalId = () =>
  `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Helper functions for localStorage
const getLocalCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("localCart");
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse local cart:", e);
    return [];
  }
};

const saveLocalCart = (items: CartItem[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("localCart", JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save local cart:", e);
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useLocalCart, setUseLocalCart] = useState(false);

  // Load cart from API on initial render
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart");
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
        const data = await response.json();
        setItems(data.items || []);
        setUseLocalCart(false);
      } catch (error) {
        console.error("Failed to load cart from API:", error);
        // Fall back to local storage
        const localCart = getLocalCart();
        setItems(localCart);
        setUseLocalCart(true);

        if (localCart.length > 0) {
          toast.info(
            "Using offline cart mode. Your cart data is stored locally.",
            {
              duration: 5000,
            },
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Sync with localStorage when using local cart
  useEffect(() => {
    if (useLocalCart) {
      saveLocalCart(items);
    }
  }, [items, useLocalCart]);

  const addItem = async (item: CartItem) => {
    try {
      setIsLoading(true);

      if (useLocalCart) {
        // Handle locally
        const existingItemIndex = items.findIndex(
          (i) => i.productId === item.productId,
        );

        if (existingItemIndex !== -1) {
          // Update existing item
          const updatedItems = [...items];
          const existingItem = updatedItems[existingItemIndex];
          if (existingItem) {
            existingItem.quantity += item.quantity;
            setItems(updatedItems);
          }
        } else {
          // Add new item with local ID
          setItems([...items, { ...item, id: generateLocalId() }]);
        }
        return;
      }

      // Try API first
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.productId,
          quantity: item.quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      // Refresh cart after adding item
      const cartResponse = await fetch("/api/cart");
      const cartData = await cartResponse.json();
      setItems(cartData.items || []);
    } catch (error) {
      console.error("Error adding item to cart via API:", error);

      // Fall back to local storage approach
      setUseLocalCart(true);

      // Add to local cart
      const existingItemIndex = items.findIndex(
        (i) => i.productId === item.productId,
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...items];
        const existingItem = updatedItems[existingItemIndex];
        if (existingItem) {
          existingItem.quantity += item.quantity;
          setItems(updatedItems);
        }
      } else {
        // Add new item with local ID
        setItems([...items, { ...item, id: generateLocalId() }]);
      }

      toast.info("Using offline cart mode. Your cart will be stored locally.", {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: string | number) => {
    try {
      setIsLoading(true);

      if (useLocalCart) {
        // Handle locally
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        return;
      }

      // Try API first
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      // Update local state
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item from cart:", error);

      // Fall back to local approach
      setUseLocalCart(true);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));

      toast.info("Using offline cart mode. Your cart will be stored locally.", {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string | number, quantity: number) => {
    if (quantity < 1) return;

    try {
      setIsLoading(true);

      if (useLocalCart) {
        // Handle locally
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        );
        return;
      }

      // Try API first
      const response = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      // Update local state
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        ),
      );
    } catch (error) {
      console.error("Error updating quantity:", error);

      // Fall back to local approach
      setUseLocalCart(true);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        ),
      );

      toast.info("Using offline cart mode. Your cart will be stored locally.", {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    if (useLocalCart) {
      localStorage.removeItem("localCart");
    }
    // This would ideally call an API to clear the cart as well
    setItems([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
