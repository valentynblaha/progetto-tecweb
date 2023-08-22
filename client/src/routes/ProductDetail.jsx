import React, { useContext, useState } from "react";
import api from "../api/api";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Rating,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AddShoppingCart, HandshakeOutlined } from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
import "./ProductDetail.css";
import CustomRating from "../components/CustomRating";
import ReviewCard from "../components/ReviewCard";
import useSnackbar from "../hooks/useSnackbar";
import useCart from "../hooks/useCart";

export const productLoader = async ({ params }) => {
  const response = await Promise.all([
    api.get("api/ecommerce/products/" + params.productId),
    api.get("api/ecommerce/reviews/" + params.productId),
  ]);
  return { product: response[0].data, reviews: response[1].data };
};

export default function ProductDetail() {
  const [auth] = useAuth();
  const { update } = useCart();
  const { product, reviews } = useLoaderData();
  const navigate = useNavigate();
  const [review, setReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  const setSnackbar = useSnackbar();

  const [qty, setQty] = useState(1);
  const { name, rating, comment } = review;
  const handleChange = (names, event) => {
    setReview({ ...review, [names]: event.target.value });
  };

  const postReview = async () => {
    try {
      const response = await api.post("api/ecommerce/reviews/", { ...review, product: product.id });
      if (response.status === 201) {
        setReview({ name: "", rating: 0, comment: "" });
        setSnackbar({ severity: "success", message: "Recensione aggiunta con successo", open: true });
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data.code === 1)
        setSnackbar({ severity: "error", message: "Esiste già una tua recensione per questo prodotto", open: true });
    }
  };

  const handleReview = (e) => {
    e.preventDefault();
    postReview();
  };

  const addToCart = async () => {
    try {
      const response = await api.post("api/ecommerce/orders/", { product: product.id, quantity: qty });
      if (response.status === 201) {
        update();
        setSnackbar({ severity: "success", message: "Prodotto aggiunto al carrello", open: true });
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data.code === 1) {
        setSnackbar({ severity: "error", message: "La quantità richiesta non è disponibile", open: true });
      } else if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setSnackbar({ severity: "error", message: String(error), open: true });
      }
    }
  };

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
            <CustomRating value={product.rating} readOnly sx={{ marginRight: "0.5em" }} />
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
          <Typography fontSize="2rem" fontWeight="bold" sx={{ my: 2 }}>
            € {product.price}
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              type="number"
              value={qty}
              label="Quantità"
              variant="outlined"
              onChange={(e) => {
                let val = Number.parseInt(e.target.value);
                if (Number.isNaN(val)) val = 1;
                if (val > product.countInStock || val < 1) return;
                setQty(val);
              }}
              sx={{ width: "6em" }}
            />
            <Button
              size="large"
              startIcon={<AddShoppingCart />}
              variant="contained"
              onClick={() => {
                addToCart();
              }}
            >
              Aggiungi al carrello
            </Button>
          </Stack>
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
      {auth.email && (
        <Paper sx={{ p: 2, m: 2 }}>
          <Grid container rowGap={1} component="form" onSubmit={handleReview}>
            <Grid item xs={12}>
              <TextField
                value={name}
                size="small"
                onChange={(e) => handleChange("name", e)}
                fullWidth
                label="Nome"
                required
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={comment}
                onChange={(e) => handleChange("comment", e)}
                multiline
                rows={4}
                fullWidth
                label="Recensione"
                required
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography>Rating:</Typography>
              <Box>
                <Rating
                  value={rating / 2}
                  sx={{ lineHeight: 1 }}
                  precision={0.5}
                  onChange={(e, newValue) => setReview({ ...review, rating: newValue * 2 })}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" type="submit">
                Insersci la recensione
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      <Divider />
      <Box>
        <Typography variant="h5" m={2}>
          Recensioni ({product.numReviews})
        </Typography>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </Box>
    </Box>
  );
}
