import React, { useEffect, useRef, useState } from "react";
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
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Alert,
} from "@mui/material";
import api from "../api/api";
import MuiFileInput from "../utils/MuiFileInput";
import { useLoaderData } from "react-router-dom";

export const signupLoader = async () => {
  const response = await api.get("api/course/fitnessCategory/");
  return { categories: response.data };
};

export default function Signup() {
  const [error, setError] = useState("");
  const errorRef = useRef(null)
  const { categories: loadedCategories } = useLoaderData();
  const [passwordRepeat , setPasswordRepeat] = useState("")
  const [values, setValues] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    gender: "",
    cod_fisc: "",
    gym_address: "",
    categories: [],
    image: null,
  });
  const [success, setSuccess] = useState(false);
  const { email, password, first_name, last_name, phone, cod_fisc, gym_address, image, categories } = values;
  const paperStyle = { padding: "30px 20px", width: 500, margin: "20px auto" };
  const avatarStyle = { backgroundColor: "blue" };
  const marginTop = { marginTop: 5 };
  const marginbottom = { marginbottom: 5 };


  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const postUserData = async () => {
    try {
      const response = await api.post("api/course/register_instructor/", values);
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
      }
      else setError(String(error));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    if (passwordRepeat !== password){
      setError(String("La password scritta nei due campi deve corrispondere"));
    }else{
      postUserData()
  }
  };
  return success ? (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <Typography variant="h5">Registrazione istruttore è avvenuta con successo</Typography>
      <Button style={{ margin: "20px 0 10px 0" }} href="/login" variant="contained" color="primary">
        Vai al Login
      </Button>
    </div>
  ) : (
    <Grid>
      <Paper elevation={20} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}></Avatar>
          <h2 style={marginbottom}>Registrazione Istruttore</h2>
        </Grid>
        {error && (
          <Alert severity="error" sx={{my: 1}} ref={errorRef}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container rowGap={1}>
            <TextField fullWidth label="Cognome" value={last_name} onChange={handleChange("last_name")} required />
            <TextField fullWidth label="Nome" value={first_name} onChange={handleChange("first_name")} required />
            <TextField fullWidth label="Email" value={email} onChange={handleChange("email")} required />
            <TextField fullWidth label="Codice fiscale" value={cod_fisc} onChange={handleChange("cod_fisc")} required />
            <TextField
              fullWidth
              label="Indirizzo palestra"
              value={gym_address}
              onChange={handleChange("gym_address")}
              required
            />
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-multiple-name-label">Categorie</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                label="Categorie"
                id="demo-multiple-name"
                multiple
                required
                value={categories}
                onChange={handleChange("categories")}
                input={<OutlinedInput label="Name" />}
                // MenuProps={MenuProps}
              >
                {loadedCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl component="fieldset" style={marginTop} required>
              <FormLabel component="legend">Sesso</FormLabel>
              <RadioGroup aria-label="gender" name="gender" style={{ display: "initial" }}>
                <FormControlLabel value="female" control={<Radio />} label="Female" onChange={handleChange("gender")} />
                <FormControlLabel value="male" control={<Radio />} label="Male" onChange={handleChange("gender")} />
              </RadioGroup>
            </FormControl>
            <TextField fullWidth label="Numero Cellulare" value={phone} onChange={handleChange("phone")} required />
            <TextField
              fullWidth
              label="Password"
              value={password}
              onChange={handleChange("password")}
              type="password"
              required
            />
            <TextField
              fullWidth
              label="Ripeti Password"
              value={passwordRepeat}
              onChange={(e) => {
                setPasswordRepeat(e.target.value);
              }}
              type="password"
              required
            />
            <MuiFileInput
              accept="image/*"
              id="instructor-image"
              url="api/course/upload_instructor/"
              style={{ width: "50px", height: "50px" }}
              onChange={(val) => setValues({ ...values, image: val })}
              onError={(e) => {
                setError(e.response?.data.image?.map((e, i) => <p key={i}>{e}</p>) || String(e))}}
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
