import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import CustomRating from "./CustomRating";

export default function ReviewCard({ review }) {
  return (
    <Box sx={{m: 2}}>
      <Paper sx={{p: 2}}>
        <h5>{review.name}</h5>
        <Typography color="#808080" fontSize="0.8rem">Da: {`${review.user.first_name} ${review.user.last_name}`.trim() || review.user.email}</Typography>
        <CustomRating value={review.rating} readOnly />
        <Typography>{review.comment}</Typography>
      </Paper>
    </Box>
  );
}
