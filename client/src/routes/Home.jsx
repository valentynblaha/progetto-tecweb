import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import CourseSubscriptionCard from "../components/CourseSubscriptionCard";
import useAuth from "../hooks/useAuth";

export const homeLoader = async () => {
  const response = await Promise.all([
    api.get("api/ecommerce/recommended?max_products=5"),
  ]);
  return { products: response[0].data };
};

export default function Home() {
  const { products } = useLoaderData();
  const [courseSubs, setCourseSubs] = useState([]);
  const [auth] = useAuth();

  const loadCourseSubs = async () => {
    if (auth.email) {
      try {
        const courseSubsResponse = await api.get("api/course/subscriptions");
        setCourseSubs(courseSubsResponse.data);
      } catch (error) {
        if (error.response.status !== 401) {
          throw error;
        }
      }
    }
  };

  useEffect(() => {
    loadCourseSubs();
  }, [auth]);

  return (
    <div>
      <Box p={2}>
        <Typography variant="h5">Prodotti consigliati</Typography>
        <Divider />
        <Grid container spacing={2} py={2}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>

        {courseSubs.length !== 0 && (
          <>
            <Typography variant="h5">I miei corsi</Typography>
            <Divider />
            <Grid container spacing={2} py={2}>
              {courseSubs.map((sub) => (
                <CourseSubscriptionCard key={sub.id} subscription={sub} />
              ))}
            </Grid>
          </>
        )}
      </Box>
    </div>
  );
}
