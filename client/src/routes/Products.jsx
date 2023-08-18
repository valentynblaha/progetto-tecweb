import {
  Box,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import api from "../api/api";
import ProductsTabPanel from "../components/ProductsTabPanel";
import { CustomTabs, CustomTab } from "../utils/CustomTabs";
import { Search } from "@mui/icons-material";
import CustomRating from "../components/CustomRating";

const SIZES = ["S", "M", "L", "XL"];

export async function productsLoader({ request }) {
  const url = new URL(request.url);
  const minPrice = url.searchParams.get("minprice");
  const maxPrice = url.searchParams.get("maxprice");
  const sizes = url.searchParams.get("sizes");
  const response = await Promise.all([
    api.get("/api/ecommerce/categories"),
    api.get("/api/ecommerce/products?minprice=" + minPrice + "&maxprice=" + maxPrice + "&sizes=" + sizes),
  ]);
  return { categories: response[0].data, products: response[1].data };
}

export default function Products() {
  const [currentTab, setCurrentTab] = useState(Number.parseInt(localStorage.getItem("curTab")) || 0);
  const { categories, products } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search state
  const [search, setSearch] = useState({
    minPrice: 0,
    maxPrice: 1000,
    sizes: SIZES,
    minRating: 5,
  });

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    localStorage.setItem("curTab", currentTab);
  }, [currentTab]);

  return (
    <Box display="flex">
      <Box sx={{ flexShrink: 2 }}>
        <Grid container spacing={1} p={1}>
          <Grid item xs={12}>
            <Typography variant="h6">Filtri di ricerca:</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
            <Stack spacing={1}>
              <Typography fontWeight="bold">Prezzo</Typography>
              <TextField
                type="number"
                variant="outlined"
                label="Min"
                sx={{ width: "20em" }}
                value={search.minPrice}
                onChange={(e) => {
                  let val = Number.parseInt(e.target.value);
                  if (Number.isNaN(val)) val = 0;
                  if (val < 0 || val > search.maxPrice) return;
                  setSearch({ ...search, minPrice: val });
                }}
              />
              <TextField
                type="number"
                variant="outlined"
                label="Max"
                sx={{ width: "20em" }}
                value={search.maxPrice}
                onChange={(e) => {
                  let val = Number.parseInt(e.target.value);
                  if (Number.isNaN(val)) val = 0;
                  if (val < search.minPrice) return;
                  setSearch({ ...search, maxPrice: val });
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Divider />
            <Stack>
              <Typography fontWeight="bold">Dimensione</Typography>
              <FormControlLabel
                label="Tutte"
                control={
                  <Checkbox
                    checked={search.sizes.length === SIZES.length}
                    indeterminate={search.sizes.length > 0 && search.sizes.length < SIZES.length}
                    onChange={(e) => setSearch({ ...search, sizes: e.target.checked ? SIZES : [] })}
                  />
                }
              />
              {SIZES.map((size) => (
                <FormControlLabel
                  key={size}
                  control={<Checkbox />}
                  label={size}
                  checked={search.sizes.indexOf(size) !== -1}
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      sizes: e.target.checked ? [...search.sizes, size] : search.sizes.filter((s) => s !== size),
                    });
                  }}
                />
              ))}
            </Stack>
          </Grid>
          {/* <Grid item xs={12}>
            <Divider />
            <Typography fontWeight="bold">Rating minimo</Typography>
            <CustomRating
              value={search.minRating}
              onChange={(_, val) => setSearch({ ...search, minRating: val * 2 })}
            />
          </Grid> */}
        </Grid>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Stack direction="row" p={2} spacing={2}>
          <Paper
            component="form"
            sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Cerca prodotto"
              inputProps={{ "aria-label": "cerca prodotto" }}
            />
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <Search />
            </IconButton>
          </Paper>
          <FormControlLabel label="Filtro avanzato" control={<Checkbox />} />
        </Stack>

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
    </Box>
  );
}
