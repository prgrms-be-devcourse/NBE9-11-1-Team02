import { create } from "zustand";

export type CartItem = {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
};

type CartState = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],

  addToCart: (item) =>
    set((state) => {
      const existing = state.cartItems.find(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existing) {
        return {
          cartItems: state.cartItems.map((cartItem) =>
            cartItem.productId === item.productId
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          ),
        };
      }

      return {
        cartItems: [...state.cartItems, item],
      };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.filter(
        (cartItem) => cartItem.productId !== productId
      ),
    })),

  clearCart: () => set({ cartItems: [] }),

  increaseQuantity: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.map((cartItem) =>
        cartItem.productId === productId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ),
    })),

  decreaseQuantity: (productId) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((cartItem) =>
          cartItem.productId === productId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0),
    })),
}));