import { Button, Card, CardActionArea, CardContent, CardMedia, Grid, Rating, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <Grid item xs={3} height={400}>
      <Card sx={{ cursor: "pointer" }}>
        <CardActionArea onClick={() => navigate(String(product.id))}>
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
              <Rating value={Number.parseInt(product.rating) / 2} readOnly precision={0.5} />
            </div>
            <div>
              <Typography fontSize="2em" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                € {product.price}
              </Typography>
            </div>
            <div>
              <Button variant="outlined" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                Aggiungi al carrello
              </Button>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
