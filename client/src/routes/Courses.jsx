import { Box, Button, Divider, Grid, List, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import api from "../api/api";
import CoursesTabPanel from "../components/CoursesTabPanel";
import { CustomTab, CustomTabs } from "../utils/CustomTabs";
import useAuth from "../hooks/useAuth";
import CourseCard from "../components/CourseCard";
import LinkBehavior from "../utils/LinkBehaviour";
import { Add } from "@mui/icons-material";

export async function coursesLoader() {
  const response = await Promise.all([api.get("/api/course/fitnessCategory"), api.get("/api/course/course")]);
  return { categories: response[0].data, courses: response[1].data };
}
export default function Courses() {
  const [currentTab, setCurrentTab] = useState(Number.parseInt(localStorage.getItem("curCourseTab")) || 0);
  const { categories, courses } = useLoaderData();
  const [auth] = useAuth();

  const myCourses = courses && auth.email ? courses.filter((c) => c.instructor === auth.id) : [];
  const availableCourses = auth.is_instructor ? courses.filter((c) => c.instructor !== auth.id) : courses || [];

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    localStorage.setItem("curCourseTab", currentTab);
  }, [currentTab]);

  return (
    <Box sx={{ width: "100%" }}>
      {auth.is_instructor && (
        <>
          <div style={{ marginTop: "1em", marginLeft: "1em", display: "flex", alignItems: "center" }}>
            <Typography variant="h5" component="span">
              Corsi insegnati
            </Typography>
            <Button component={LinkBehavior} to="create" variant="contained" startIcon={<Add />} sx={{ mx: 2 }}>
              Aggiungi corso
            </Button>
          </div>

          <Divider />
          <div style={{ margin: "0.5em", overflowX: "auto", display: "flex" }}>
            {myCourses.map((course) => (
              <div key={course.id} style={{ padding: "0.5em" }}>
                <CourseCard course={course} width="20rem" instructor_view />
              </div>
            ))}
          </div>
        </>
      )}
      <Typography variant="h5" marginLeft={2} marginTop={2}>
        Corsi a cui ti puoi iscrivere
      </Typography>
      <Divider />
      <Box>
        <CustomTabs value={currentTab} onChange={handleChange} aria-label="courses tabs">
          {categories.map((val) => (
            <CustomTab key={val.id} label={val.name} />
          ))}
        </CustomTabs>
      </Box>
      {categories.map((val, index) => (
        <CoursesTabPanel
          key={val.id}
          value={currentTab}
          index={index}
          courses={availableCourses.filter((prod) => Number.parseInt(prod.category) === val.id)} // TODO: might not work if category id is a number
        />
      ))}
    </Box>
  );
}
