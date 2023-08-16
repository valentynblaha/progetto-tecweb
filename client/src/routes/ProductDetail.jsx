import React, { useState } from "react";
import api from "../api/api";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Box, Button, Divider, Grid, Paper, Rating, TextField, Typography} from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import "./ProductDetail.css";
import CustomRating from "../components/CustomRating";
import ReviewCard from "../components/ReviewCard";

export const productLoader = async ({ params }) => {
  const response = await Promise.all([
    api.get("api/ecommerce/products/" + params.productId),
    api.get("api/ecommerce/reviews/" + params.productId),
  ]);
  return { product: response[0].data, reviews: response[1].data };
};

export default function ProductDetail() {
  
  const navigate = useNavigate();
  const { product, reviews } = useLoaderData();
  const { value, setValue} = useState({ 
    name: "",
    rating: "",
    comment: "",
  });
  
  const { name, rating, comment } = {value} ;
  const handleChange = (names) => (event) => {
    setValue({ ...value, [names]: event.target.value });
  };
 
  var isAuthenticated = true
  const postReview = async(product,name, rating,comment) => {
        const response = await api.post("api/ecommerce/reviews/", { product, name , rating , comment });
        console.log(response)
        return response
  }

  const handleReview = () =>{
    if(isAuthenticated){
      const response = postReview(product.productId,name,rating,comment)
   }else{
       navigate('/login')
   }
  }
   
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
          <Button size="large" startIcon={<AddShoppingCart />} variant="outlined">
            Aggiungi al carrello
          </Button>

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
           <Paper sx={{ p:1, my: 1}}>
            <Grid container rowGap={1}>
                <Typography variant='h7'>Nome:</Typography>
                <TextField  value={name} size="small" onChange={handleChange("name")} fullWidth label='Nome'></TextField>
                <Typography variant='h7'>Recensione:</Typography>
                <TextField value={comment} onChange={handleChange("comment")} multiline fullWidth label='Recensione'></TextField>
                <Typography variant='h7'>Ratings:</Typography>
                <Rating style={{ margin: "0px 0px 0px 20px"}} Value={rating} precision={0.5} onChange={handleChange("rating")}/>
                <Button variant="contained" style={{ margin: "10px 0px 10px 650px"}}  onClick={handleReview}>Insersci la recensione</Button>      
            </Grid>
           </Paper>
            
     
        </Grid>
      </Grid>
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
