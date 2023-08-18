import { AddShoppingCart } from "@mui/icons-material";
import { Button, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import LazyImg from "../utils/LazyImg";
import LinkBehavior from "../utils/LinkBehaviour";
import CustomRating from "./CustomRating";

export default function ProductCard({ product }) {

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
          <div>
            <CustomRating value={product.rating} readOnly />
          </div>
          <div>
            <Typography fontSize="2em" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
              € {product.price}
            </Typography>
          </div>
          <div>
            <Button
              variant="outlined"
              startIcon={<AddShoppingCart />}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              Aggiungi al carrello
            </Button>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
}
