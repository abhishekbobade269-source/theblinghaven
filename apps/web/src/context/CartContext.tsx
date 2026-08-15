'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string; // product id + size combo
  productId: string;
  sku: string;
  title: string;
  slug: string;
  unitPriceUsd: number;
  quantity: number;
  primaryImageUrl: string;
  selectedRingSize?: string;
  selectedBangleSize?: string;
  customEngraving?: string;
  hallmarkCertificate?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotalUsd: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  subtotalUsd: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theblinghaven_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem('theblinghaven_cart', JSON.stringify(newItems));
    } catch {}
  };

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const id = `${item.productId}-${item.selectedRingSize || 'nosize'}-${item.customEngraving || 'noeng'}`;
    const existingIdx = items.findIndex((i) => i.id === id);

    let updated: CartItem[];
    if (existingIdx > -1) {
      updated = [...items];
      updated[existingIdx].quantity += item.quantity;
    } else {
      updated = [...items, { ...item, id }];
    }
    saveCart(updated);
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    saveCart(items.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = items
      .map((i) => {
        if (i.id === id) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      })
      .filter(Boolean) as CartItem[];

    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalUsd = items.reduce((sum, i) => sum + i.unitPriceUsd * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotalUsd,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
