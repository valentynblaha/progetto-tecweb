import { AddShoppingCart } from "@mui/icons-material";
import { Button, Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import LazyImg from "../utils/LazyImg";
import LinkBehavior from "../utils/LinkBehaviour";
import CustomRating from "./CustomRating";
import useSnackbar from "../hooks/useSnackbar";
import api from "../api/api";
import useCart from "../hooks/useCart";

export default function ProductCard({ product }) {

  const setSnackbar = useSnackbar()
  const {update} = useCart()

  const handleAddToCart = async() => {
    try {
      const response = await api.post("api/ecommerce/orders/", { product: product.id, quantity: 1})
      if (response.status === 201) {
        setSnackbar({ severity: "success", message: "Prodotto aggiunto al carrello", open: true });
        update()
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data.code === 1) {
        setSnackbar({ severity: "error", message: "Il prodotto non è più disponibile", open: true });
      }
    }
  }

  return (
    <Grid item xs={3}>
      <Card>
        <CardActionArea to={"/products/" + String(product.id)} component={LinkBehavior}>
          <LazyImg src={product.image} alt="Product image" width="100%" height={200} objectFit="contain" />
        </CardActionArea>
        <CardContent>
          <div>
            <Typography fontWeight="bold">{product.name}</Typography>
          </div>
          <div style={{ display: "block", height: "3.2em", overflow: "hidden" }}>
            <Typography color="#808080">{product.description}</Typography>
          </div>
          <Stack direction="row" spacing={1}>
            <CustomRating value={product.rating} readOnly />
            <span>{`(${product.numReviews})`}</span>
          </Stack>
          <div>
            <Typography fontSize="2em" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
              € {product.price}
            </Typography>
          </div>
          <div>
            <Button
              variant="outlined"
              startIcon={<AddShoppingCart />}
              onClick={(e) => handleAddToCart()}
            >
              Aggiungi al carrello
            </Button>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
}
