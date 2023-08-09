import { Box, Grid, Typography } from '@mui/material';
import React from 'react'
import ProductCard from './ProductCard';

export default function ProductsTabPanel(props) {
    const { value, index, products } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && (
          <Grid container sx={{ p: 2 }} spacing={2}>
            {products.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </Grid>
        )}
      </div>
    );
}
