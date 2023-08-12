import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import api from "../api/api";
import CoursesTabPanel from "../components/CoursesTabPanel";
import { CustomTab, CustomTabs } from "../utils/CustomTabs";


export async function coursesLoader() {
  const response = await Promise.all([
    api.get("/api/course/fitnessCategory"),
    api.get("/api/course/course"),
  ]);
  return { categories: response[0].data, courses: response[1].data };
}
export default function Courses() {
  const [currentTab, setCurrentTab] = useState(Number.parseInt(localStorage.getItem("curCourseTab")) || 0);
  const { categories, courses } = useLoaderData();

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    localStorage.setItem("curCourseTab", currentTab)
  }, [currentTab])

  return (
    <Box sx={{ width: "100%"}}>
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
          courses={courses ? courses.filter((prod) => Number.parseInt(prod.category) === val.id) : []} // TODO: might not work if category id is a number
        />
      ))}
    </Box>
  );
}
