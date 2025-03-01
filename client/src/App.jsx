import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ErrorPage from "./components/ErrorPage";
import { AuthProvider } from "./context/AuthContext";
import CourseDetail, { courseLoader } from "./routes/CourseDetail";
import Courses, { coursesLoader } from "./routes/Courses";
import EditCourse, { courseCreateAction, courseEditAction, newCourseLoader } from "./routes/EditCourse";
import Home, { homeLoader } from "./routes/Home";
import Login from "./routes/Login";
import ProductDetail, { productLoader } from "./routes/ProductDetail";
import Products, { productsLoader } from "./routes/Products";
import Root from "./routes/Root";
import Signup from "./routes/Signup";
import PasswordChange from "./routes/ResetPassword";
import SignupInstructor, { signupLoader } from "./routes/SignupInstructor";
import Cart, { cartLoader } from "./routes/Cart";
import { SnackbarProvider } from "./context/SnackbarContext";
import { CartProvider } from "./context/CartContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: homeLoader,
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
        element: <EditCourse />,
        loader: newCourseLoader,
        action: courseCreateAction,
      },
      {
        path: "/courses/:courseId/edit",
        loader: courseLoader,
        element: <EditCourse />,
        action: courseEditAction,
      },
      {
        path: "/cart",
        loader: cartLoader,
        element: <Cart />,
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
    path: "/reset",
    element: <PasswordChange />,
  },
  {
    path: "/signup/instructor",
    loader: signupLoader,
    element: <SignupInstructor />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CartProvider>
          <SnackbarProvider>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </CartProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default App;
