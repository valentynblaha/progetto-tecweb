import { Alert, Snackbar } from "@mui/material";
import React, { createContext, useCallback, useMemo, useState } from "react";
import api from "../api/api";
import useAuth from "../hooks/useAuth";

/**
 * @type {React.Context<{cartCount: number, update: () => Promise}>}
 */
const CartContext = createContext({cartCount: 0, update: () => Promise.resolve(null)});

export function CartProvider({ children }) {
  const [cart, setCart] = useState(0);
  const [auth] = useAuth()

  const update = async () => {
    if (!auth.email) return;
    try {
      const response = await api.get("api/ecommerce/cart");
      if (response.status === 200) {
        setCart(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const val = useMemo(() => ({cart, update}), [cart])

  return (
    <CartContext.Provider value={val}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
