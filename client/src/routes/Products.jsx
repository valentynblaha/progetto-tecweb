import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import api from "../api/api";
import ProductsTabPanel from "../components/ProductsTabPanel";
import { CustomTabs, CustomTab } from "../utils/CustomTabs";


export async function productsLoader() {
  const response = await Promise.all([
    api.get("/api/ecommerce/categories"),
    api.get("/api/ecommerce/products"),
  ]);
  return { categories: response[0].data, products: response[1].data };
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
        <CustomTabs value={currentTab} onChange={handleChange} aria-label="basic tabs example">
          {categories.map((val) => (
            <CustomTab key={val.id} label={val.name} />
          ))}
        </CustomTabs>
      </Box>
      {categories.map((val, index) => (
        <ProductsTabPanel
          key={val.id}
          value={currentTab}
          index={index}
          category={val}
          products={products ? products.filter((prod) => Number.parseInt(prod.category) === val.id) : []} // TODO: might not work if category id is a number
        />
      ))}
    </Box>
  );
}
