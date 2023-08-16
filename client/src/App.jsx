import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Root from "./routes/Root";
import Home from "./routes/Home";
import Products, { productsLoader } from "./routes/Products";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import SignupInstructor from "./routes/SignupInstructor";
import ErrorPage from "./components/ErrorPage";
import ProductDetail, { productLoader } from "./routes/ProductDetail";
import Courses, { coursesLoader } from "./routes/Courses";
import EditCourse, { courseCreateAction, courseEditAction, newCourseLoader } from "./routes/EditCourse";
import CourseDetail, { courseLoader } from "./routes/CourseDetail";
import { AuthProvider } from "./context/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/products",
        loader: productsLoader,
        element: <Products />,
      },
      {
        path: "/products/:productId",
        loader: productLoader,
        element: <ProductDetail />,
      },
      {
        path: "/courses",
        loader: coursesLoader,
        element: <Courses />,
      },
      {
        path: "/courses/:courseId",
        loader: courseLoader,
        element: <CourseDetail />,
      },
      {
        path: "/courses/create",
        element: <EditCourse/>,
        loader: newCourseLoader,
        action: courseCreateAction
      },
      {
        path: "/courses/:courseId/edit",
        loader: courseLoader,
        element: <EditCourse />,
        action: courseEditAction,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup/user",
    element: <Signup />,
  },
  {
    path: "/signup/instructor",
    element: <SignupInstructor />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default App;
