import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import ProductsTabPanel from "../components/ProductsTabPanel";
import { useLoaderData } from "react-router-dom";
import api from "../api/api";


export async function productsLoader() {
  // TODO: refactor to support simultaneous api calls and errors
  const categoriesResponse = await api.get("/api/ecommerce/categories");
  const productsResponse = await api.get("/api/ecommerce/products");
  const products = productsResponse.data;
  const categories = categoriesResponse.data;
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
          products={products ? products.filter((prod) => Number.parseInt(prod.category) === val.id) : []} // TODO: might not work if category id is a number
        />
      ))}
    </Box>
  );
}
