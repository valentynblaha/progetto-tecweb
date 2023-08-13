import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Avatar, TextField, Button, Typography } from "@mui/material";
import api from "../api/api";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [auth, setAuth] = useAuth();
  const [error, setError] = useState("");

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const { email, password } = values;
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.email) {
      navigate("/");
    }
  }, [])

  const postUserData = async(email, password) => {
    try {
      const response = await api.post("api/user/token/", { email, password });
      const { access, refresh } = response.data;
      localStorage.setItem("accesstoken", access);
      localStorage.setItem("refreshtoken", refresh);
      const { data: user } = await api.get("api/user/register_user/");
      if (!user) {
        throw new Error("Errore nel recapitare i dati dell'utente");
      }
      setAuth(user);
      performRedirect();
    } catch (error) {
      setError(String("Email o password non corretti"));
    }
  }

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const performRedirect = () => {
    navigate("/");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    postUserData(email, password);
  };

  const paperStyle = { padding: 20, height: "70vh", width: 380, margin: "20px auto" };
  const avatarStyle = { backgroundColor: "blue" };
  const btnstyle = { margin: "20px 0" };
  const btnstyle2 = { margin: "20px 0 10px 0" };
  return (
    <Grid component="form">
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}></Avatar>
          <h2>Sign In</h2>
        </Grid>
        {error && (
          <div
            style={{
              background: "rgb(255 0 43 / 21%)",
              border: "2px solid red",
              borderRadius: "0.5em",
              padding: "0.5em",
              marginBottom: "0.5em",
            }}
          >
            {error}
          </div>
        )}
        <Grid container rowGap={1}>
          <TextField
            label="Email"
            placeholder="Enter Email"
            value={email}
            onChange={handleChange("email")}
            fullWidth
            required
          />
          <TextField
            label="Password"
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={handleChange("password")}
            fullWidth
            required
          />
        </Grid>
        <Button type="submit" color="primary" variant="contained" onClick={handleSubmit} style={btnstyle} fullWidth>
          Sign in
        </Button>
        <Typography align="center"> Sei nuovo su Fitcourse?</Typography>
        <Button variant="outlined" align="center" style={btnstyle2} fullWidth href="/signup/user">
          registrati come utente
        </Button>
        <Button variant="outlined" align="center" fullWidth href="/signup/instructor">
          registrati come istruttore
        </Button>
      </Paper>
    </Grid>
  );
}

// <Link href="/signup" underline='none' >
//{' '} iscriviti
//</Link>
