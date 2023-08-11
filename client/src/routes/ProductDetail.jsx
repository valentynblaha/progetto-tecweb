import React from "react";
import api from "../api/api";
import { useLoaderData } from "react-router-dom";
import { Box, Button, Divider, Grid, Paper, Rating, Typography } from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import "./ProductDetail.css";

export const productLoader = async ({ params }) => {
  const response = await api.get("api/ecommerce/products/" + params.productId);
  const product = response.data;
  return { product };
};

export default function ProductDetail() {
  const { product } = useLoaderData();

  return (
    <Box>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={4}>
          <img src={product.image} alt="Product image" className="w-100" />
        </Grid>
        <Grid item xs={8} flexDirection="column">
          <div>
            <h1>{product.name}</h1>
          </div>
          <Typography>Da: {product.brand}</Typography>
          <div className="d-flex align-items-center">

            <Rating precision={0.5} value={product.rating / 2} readOnly sx={{marginRight: "0.5em"}}/>
            <span>{"(" + product.numReviews + ")"}</span>
          </div>

          <Paper sx={{ p: 1, my: 1 }}>
            {product.description ? (
              <Typography>{product.description}</Typography>
            ) : (
              <Typography color="#808080" fontStyle="italic">
                Non c&apos;è una descrizione per questo prodotto
              </Typography>
            )}
          </Paper>
          <Typography color="#808080" fontSize="0.8rem">
            Prezzo:
          </Typography>
          <Typography fontSize="2rem" fontWeight="bold" sx={{my: 2}}>
            € {product.price}
          </Typography>
          <Button size="large" startIcon={<AddShoppingCart/>} variant="outlined">Aggiungi al carrello</Button>
          
          <Paper sx={{ p: 1, my: 1 }}>
          <Typography color="#808080">Dettagli:</Typography>
          <table className="product-details-table">
            <tbody>
              <tr>
                <td>Disponibilità:</td>
                <td>{product.countInStock}</td>
              </tr>
              <tr>
                <td>Dimensione:</td>
                <td>{product.size}</td>
              </tr>
            </tbody>
          </table>
          </Paper>
          
        </Grid>
      </Grid>
      <Divider/>
      <Box>
        <Typography variant="h5" m={2}>Recensioni ({product.numReviews})</Typography>
      </Box>
    </Box>
  );
}
