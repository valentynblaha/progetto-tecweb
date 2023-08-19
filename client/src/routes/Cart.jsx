import React, { useState } from "react";
import api from "../api/api";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Alert, Button, Grid, Snackbar, Stack, TextField, Typography } from "@mui/material";
import OrderCard from "../components/OrderCard";
import useSnackbar from "../hooks/useSnackbar";
import { LocalMall } from "@mui/icons-material";
import useCart from "../hooks/useCart";

export const cartLoader = async () => {
  const response = await Promise.all([api.get("api/ecommerce/orders")]);
  const orders = response[0].data;
  const productResponse = await Promise.all(orders.map((o) => api.get("api/ecommerce/products/" + o.product)));
  return { orders, products: productResponse.map((r) => r.data) };
};

export default function Cart() {
  const { orders, products } = useLoaderData();
  const [cardNumber, setCardNumber] = useState("");
  const [address, setAddress] = useState("");
  const [processingOrder, setProcessingOrder] = useState(false);
  const navigate = useNavigate();
  const {update} = useCart()

  const setSnackbar = useSnackbar();

  const handleRemove = async (id) => {
    try {
      const response = await api.delete(`api/ecommerce/orders/${id}`);
      if (response.status === 204) {
        navigate(0);
      }
    } catch (error) {
      setSnackbar({ severity: "error", message: "Errore durante la rimozione dell'ordine", open: true });
    }
  };

  const handlePurchase = async () => {
    setProcessingOrder(true);
    try {
      const response = await api.post("api/ecommerce/checkout/", {
        card_number: cardNumber,
        shipping_address: address,
      });
      if (response.status === 201) {
        setSnackbar({ severity: "success", message: "Ordine avvenuto con successo", open: true });
        update()
        setTimeout(() => {
          if (window.location.pathname === "/cart") {
            navigate("/products");
          }
        }, 2000);
      }
    } catch (error) {
      setSnackbar({ severity: "error", message: "Errore durante il pagamento", open: true });
    }
  };

  return (
    <>
      <Grid container spacing={2} p={2}>
        {orders.map((order) => (
          <Grid key={order.id} item xs={3}>
            <OrderCard
              order={order}
              product={products.find((p) => p.id === order.product)}
              onRemove={(e) => {
                handleRemove(order.id);
              }}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Typography>Totale:</Typography>

          <Typography variant="h2" component="span">
            € {orders.reduce((total, order) => total + order.total_price, 0).toFixed(2)}
          </Typography>
        </Grid>
        {orders.length > 0 && (
          <Grid
            item
            xs={12}
            container
            spacing={2}
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handlePurchase();
            }}
          >
            <Grid item xs={6}>
              <TextField
                required
                sx={{ width: "100%" }}
                variant="outlined"
                label="Numero di carta"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                sx={{ width: "100%" }}
                variant="outlined"
                label="Indirizzo di consegna"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={processingOrder}
                type="submit"
                variant="contained"
                size="large"
                startIcon={<LocalMall />}
              >{`Procedi all'ordine`}</Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
}
