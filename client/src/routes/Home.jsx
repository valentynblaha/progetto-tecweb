import React, { useEffect } from "react";
import api from "../api/api";
import { Button } from "@mui/material";

export default function Home() {

  const callApi = async () => {
    const data = await api.get("/api/course/course/");
    console.log(data)
  }

  return (
    <div>
      <h1>Home</h1>
      <Button onClick={() => callApi()} variant="outlined">Test Api</Button>
    </div>
  );
}
