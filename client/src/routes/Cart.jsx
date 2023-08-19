import React, { useState } from "react";
import api from "../api/api";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Alert, Grid, Snackbar, Typography } from "@mui/material";
import OrderCard from "../components/OrderCard";

export const cartLoader = async () => {
  const response = await Promise.all([api.get("api/ecommerce/orders")]);
  const orders = response[0].data;
  const productResponse = await Promise.all(orders.map((o) => api.get("api/ecommerce/products/" + o.product)));
  return { orders, products: productResponse.map((r) => r.data) };
};

export default function Cart() {
  const { orders, products } = useLoaderData();
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "success",
    open: false,
  });

  const handleRemove = async (id) => {
    try {
      const response = await api.delete(`api/ecommerce/orders/${id}`);
      if (response.status === 204) {
        navigate(0);
      }
    } catch (error) {
      setSnackbar({severity: "error", message: "Errore durante la rimozione dell'ordine", open: true})
    }
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Grid container spacing={2} p={2}>
        {orders.map((order) => (
          <Grid key={order.id} item xs={3}>
            <OrderCard order={order} product={products.find((p) => p.id === order.product)} onRemove={e => {
              handleRemove(order.id)
            }}/>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Typography>Totale:</Typography>
          <Typography variant="h2">
            € {orders.reduce((total, order) => total + order.total_price, 0).toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
