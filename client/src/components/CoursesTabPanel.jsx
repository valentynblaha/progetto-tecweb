import { Grid } from "@mui/material";
import React from "react";
import CourseCard from "./CourseCard";

export default function CoursesTabPanel({ value, index, courses }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Grid container sx={{ p: 2 }} spacing={2}>
          {courses.map((course) => (
            <Grid item xs={3} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}
