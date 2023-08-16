import { Button, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <Grid item xs={3}>
      <Card sx={{ cursor: "pointer" }}>
        <CardActionArea onClick={() => navigate(String(course.id))} component="div">
          <CardContent>
            <div>
              <Typography fontWeight="bold">{course.name}</Typography>
            </div>
            <div>
              <Typography fontSize="2em" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                € {course.price}
              </Typography>
            </div>
            <div>
              <Button variant="outlined" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                Iscriviti
              </Button>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
