import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import ProductsTabPanel from "../components/ProductsTabPanel";
import { useLoaderData } from "react-router-dom";
import api from "../api/api";

const CATEGORY_CHOICES = {
  C: "cloth",
  SP: "supplement",
  EX: "excercise equipme",
};

export async function productsLoader({ params }) {
  const categories = Object.keys(CATEGORY_CHOICES).map((v) => ({ id: v, name: CATEGORY_CHOICES[v] }));
  const productsData = await api.get("/api/ecommerce/products");
  const products = productsData.data;
  return { categories, products };
}

export default function Products() {
  const [value, setValue] = useState(0);
  const { categories, products } = useLoaderData();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {categories.map((val) => (
            <Tab key={val.id} label={val.name} />
          ))}
        </Tabs>
      </Box>
      {categories.map((val, index) => (
        <ProductsTabPanel
          key={val.id}
          value={value}
          index={index}
          products={products ? products.filter((prod) => prod.category === val.id) : []}
        />
      ))}
    </Box>
  );
}
