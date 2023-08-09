import React, { useState } from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import './App.css'
import Root from './routes/Root'
import Home from './routes/Home'
import Products, { productsLoader } from './routes/Products'
import Login from './routes/Login'
import Signup from './routes/Signup'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "/products",
        loader: productsLoader,
        element: <Products/>,
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/signup",
    element: <Signup/>
  }
])

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
