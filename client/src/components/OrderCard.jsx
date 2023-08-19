import { AddShoppingCart } from "@mui/icons-material";
import { Button, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import LazyImg from "../utils/LazyImg";
import LinkBehavior from "../utils/LinkBehaviour";
import CustomRating from "./CustomRating";
import api from "../api/api";

export default function OrderCard({ order, product, onRemove }) {

  return (
    <Card>
      <CardActionArea to={"/products/" + String(product.id)} component={LinkBehavior}>
        <LazyImg src={product.image} alt="Product image" width="100%" height={200} objectFit="contain" />
      </CardActionArea>
      <CardContent>
        <div>
          <Typography fontWeight="bold">{product.name}</Typography>
        </div>
        <div>
          <CustomRating value={product.rating} readOnly />
        </div>
        <div>
          <Typography>Quantità: {order.quantity}</Typography>
        </div>
        <div>
          <Typography>Totale:</Typography>
          <Typography fontSize="2em" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
            € {order.total_price.toFixed(2)}
          </Typography>
        </div>
        <div>
          <Button
            variant="outlined"
            color="error"
            onClick={onRemove}
          >
            Rimuovi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
