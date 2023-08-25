import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import MuiFileInput from "../utils/MuiFileInput";
import api from "../api/api";

export default function Signup() {
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    email: "",
    password: "",
    passwordRepeat: "",
    first_name: "",
    last_name: "",
    phone: "",
    gender: "",
    image: null,
  });

  const [success, setSuccess] = useState(false);
  const { email, password, passwordRepeat, first_name, last_name, phone, image } = values;

  const paperStyle = { padding: "30px 20px", width: 400, margin: "20px auto" };
  const avatarStyle = { backgroundColor: "blue" };
  const marginTop = { marginTop: 5 };
  const marginbottom = { marginbottom: 5 };

  const postUserData = async () => {
    try {
      const response = await api.post("api/user/register_user/", values);
      if (response.status === 201) {
        setSuccess(true);
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data.password) {
        setError(
          <ul>
            {error.response.data.password.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        );
      } else if (error.response?.status === 400 && error.response?.data.email) {
        setError(
          <ul>
            {error.response.data.email.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        );
      } else if (error.response?.status === 400 && error.response?.data.image) {
        setError(
          <ul>
            {error.response.data.image.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        );
      }
      else setError(String(error));
    }
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postUserData();
  };

  return success ? (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <Typography variant="h5">Registrazione utente è avvenuta con successo</Typography>
      <Button style={{ margin: "20px 0 10px 0" }} href="/login" variant="contained" color="primary">
        Vai al Login
      </Button>
    </div>
  ) : (
    <Grid>
      <Paper elevation={20} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}></Avatar>
          <h2 style={marginbottom}>Registrazione Utente</h2>
        </Grid>
        {error && (
          <Alert severity="error" sx={{ my: 1 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container rowGap={1}>
            <TextField fullWidth label="Nome" value={first_name} onChange={handleChange("first_name")} required />
            <TextField fullWidth label="Cognome" value={last_name} onChange={handleChange("last_name")} />
            <TextField fullWidth label="Email" value={email} onChange={handleChange("email")} required type="email"/>
            <FormControl component="fieldset" style={marginTop} required>
              <FormLabel component="legend">Sesso</FormLabel>
              <RadioGroup aria-label="gender" name="gender" style={{ display: "initial" }}>
                <FormControlLabel value="female" control={<Radio />} label="F" onChange={handleChange("gender")} />
                <FormControlLabel value="male" control={<Radio />} label="M" onChange={handleChange("gender")} />
              </RadioGroup>
            </FormControl>
            <TextField fullWidth label="Numero Cellulare" value={phone} onChange={handleChange("phone")} required />
            <TextField
              fullWidth
              required
              label="Password"
              type="password"
              value={password}
              onChange={handleChange("password")}
            />
            <TextField
              fullWidth
              required
              label="Ripeti password"
              type="password"
              value={passwordRepeat}
              onChange={handleChange("passwordRepeat")}
            />
            <MuiFileInput
              accept="image/*"
              id="user-image"
              url="api/user/upload/"
              style={{ width: "50px", height: "50px" }}
              onChange={(val) => setValues({ ...values, image: val })}
              required
            >
              Carica immagine
            </MuiFileInput>
          </Grid>
          <Button style={marginTop} type="submit" variant="contained" color="primary">
            Sign up
          </Button>
        </form>
      </Paper>
    </Grid>
  );
}
