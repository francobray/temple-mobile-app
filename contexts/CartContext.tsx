import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  options?: { [key: string]: any };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, options?: { [key: string]: any }) => void;
  updateQuantity: (id: string, quantity: number, options?: { [key: string]: any }) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: CartItem) => {
    setItems(currentItems => {
      // Find existing item with same id and options
      const existingItem = currentItems.find(item => 
        item.id === newItem.id && 
        JSON.stringify(item.options || {}) === JSON.stringify(newItem.options || {})
      );
      
      if (existingItem) {
        // Increase quantity of existing item by the new item's quantity
        return currentItems.map(item =>
          item.id === newItem.id && 
          JSON.stringify(item.options || {}) === JSON.stringify(newItem.options || {})
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      // Add new item to cart
      return [...currentItems, newItem];
    });
  };

  const removeItem = (id: string, options?: { [key: string]: any }) => {
    setItems(currentItems => 
      currentItems.filter(item => {
        if (item.id !== id) return true;
        if (options) {
          return JSON.stringify(item.options || {}) !== JSON.stringify(options);
        }
        return false;
      })
    );
  };

  const updateQuantity = (id: string, quantity: number, options?: { [key: string]: any }) => {
    if (quantity <= 0) {
      removeItem(id, options);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item => {
        if (item.id !== id) return item;
        if (options && JSON.stringify(item.options || {}) !== JSON.stringify(options)) {
          return item;
        }
        return { ...item, quantity };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
