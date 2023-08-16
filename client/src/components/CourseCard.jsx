import { Button, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import LazyImg from "../utils/LazyImg";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <Grid item xs={3}>
      <Card sx={{ cursor: "pointer" }}>
        <CardActionArea onClick={() => navigate(String(course.id))} component="div">
          {course.image ? <LazyImg
            src={course.image}
            alt="Course image"
            width="100%"
            height={200}
            objectFit = "cover"
          /> : <img src="public/placeholder.svg" style={{objectFit: "cover", height: 200, width: "100%"}}/>}
          <CardContent>
            <div>
              <Typography fontWeight="bold">{course.name}</Typography>
            </div>
            <div>
              <Typography fontSize="2em" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden" component="span">
                € {course.price}
              </Typography>
              <Typography component="span" color="#808080">
                /mese
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
