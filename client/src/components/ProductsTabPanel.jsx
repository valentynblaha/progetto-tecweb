import { Box, Grid, Typography } from '@mui/material';
import React from 'react'
import ProductCard from './ProductCard';

export default function ProductsTabPanel({ value, index, products, category }) {

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && (
          <Grid container sx={{ p: 2 }} spacing={2}>
            {products.length === 0 && <Grid item xs={12}><Typography textAlign="center" fontStyle="italic">Non ci sono prodotti nella categoria {category.name}</Typography></Grid>}
            {products.map(prod => (
              <ProductCard key={prod.id} product={prod}/>
            ))}
          </Grid>
        )}
      </div>
    );
}
