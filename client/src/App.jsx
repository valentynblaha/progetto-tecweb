import React, { useState } from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import './App.css'
import Root from './routes/Root'
import Home from './routes/Home'
import Products, { productsLoader } from './routes/Products'
import Login from './routes/Login'
import Signup from './routes/Signup'
import SignupInstructor from './routes/SignupInstructor'
import ErrorPage from './components/ErrorPage'
import ProductDetail, { productLoader } from './routes/ProductDetail'
import Courses, { coursesLoader } from './routes/Courses'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "/products",    
        loader: productsLoader,
        element: <Products/>,
      },
      {
        path: "/products/:productId",
        loader: productLoader,
        element: <ProductDetail/>
      },
      {
        path: "/courses",    
        loader: coursesLoader,
        element: <Courses/>,
      },
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/signup/user",
    element: <Signup/>
  },
  {
    path: "/signup/instructor",
    element: <SignupInstructor/>
  }
])

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
