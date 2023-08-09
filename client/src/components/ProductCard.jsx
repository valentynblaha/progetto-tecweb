import { Button, Card, CardContent, CardMedia, Grid, Rating, Typography } from "@mui/material";
import React from "react";

export default function ProductCard({ product }) {
  return (
    <Grid item xs={3} height={400}>
      <Card>
        <img
          src={product.image}
          alt="Product image"
          width="auto"
          height={200}
          style={{ objectFit: "contain", width: "100%" }}
        />
        <CardContent>
          <div>
            <Typography fontWeight="bold">{product.name}</Typography>
          </div>
          <div style={{ display: "block", height: "3.2em", overflow: "hidden" }}>
            <Typography color="#808080">{product.description}</Typography>
          </div>
          <div>
            <Rating value={Number.parseInt(product.rating) / 2} readOnly />
          </div>
          <div>
            <Typography fontSize="2em" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
              € {product.price}
            </Typography>
          </div>
          <div>
            <Button variant="outlined">Aggiungi al carrello</Button>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
}
