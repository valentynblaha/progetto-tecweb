import React, { useEffect } from 'react'
import api from '../api/api'
import { Button } from '@mui/material';

export default function Home() {

useEffect(() => {
  console.log("API called");
  const data = api.get("/api/course/course/");
}, [])

  return (
    <div>
      <h1>Home</h1>
      <Button onClick={() => console.log("Hello")}></Button>
    </div>
  )
}
