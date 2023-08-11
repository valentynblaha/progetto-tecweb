import { Box, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
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
  const [currentTab, setCurrentTab] = useState(Number.parseInt(localStorage.getItem("curTab")) || 0);
  const { categories, products } = useLoaderData();

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    localStorage.setItem("curTab", currentTab)
  }, [currentTab])

  return (
    <Box sx={{ width: "100%"}}>
      <Box>
        <Tabs value={currentTab} onChange={handleChange} aria-label="basic tabs example">
          {categories.map((val) => (
            <Tab key={val.id} label={val.name} />
          ))}
        </Tabs>
      </Box>
      {categories.map((val, index) => (
        <ProductsTabPanel
          key={val.id}
          value={currentTab}
          index={index}
          products={products ? products.filter((prod) => Number.parseInt(prod.category) === val.id) : []} // TODO: might not work if category id is a number
        />
      ))}
    </Box>
  );
}
