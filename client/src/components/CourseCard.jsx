import { Button, Card, CardActionArea, CardContent, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import LazyImg from "../utils/LazyImg";
import { Delete, Edit } from "@mui/icons-material";
import LinkBehavior from "../utils/LinkBehaviour";

export default function CourseCard({ course, width, instructor_view = false }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ width: width, flexShrink: width ? 0 : 1 }}>
      <CardActionArea onClick={() => navigate(String(course.id))} component="div">
        {course.image ? (
          <LazyImg src={course.image} alt="Course image" width="100%" height={200} objectFit="cover" />
        ) : (
          <img src="public/placeholder.svg" style={{ objectFit: "cover", height: 200, width: "100%" }} />
        )}
      </CardActionArea>
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
          {instructor_view ? (
            <>
            <Button
              startIcon={<Edit />}
              variant="outlined"
              component={LinkBehavior}
              to={`${course.id}/edit`}
            >
              Modifica
            </Button>
            <IconButton
              variant="contained"
              color="error"
              sx={{marginLeft: 1}}
            >
              <Delete/>
            </IconButton>
            </>
          ) : (
            <Button variant="outlined" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
              Iscriviti
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
