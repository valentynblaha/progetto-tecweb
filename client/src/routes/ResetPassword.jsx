import React, { useState } from 'react';
import { Button, TextField,  Avatar, Paper,Grid } from "@mui/material";
import api from "../api/api";
import useAuth from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';


function PasswordChange() {
  const [auth] = useAuth();
  const navigate = useNavigate()

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState("");
  const {oldPassword,newPassword,confirmNewPassword} = passwordData;
  const handleChange = (name) => (event) =>{
    setPasswordData({ ...passwordData, [name]: event.target.value});
  };

  const postUserData = async ( values ) => {
    try {
        const response = await api.post( "api/user/reset-password/",  values );
        if (response.status === 201) {
           navigate('/')
        }
      } catch (error) {
        if (error.response?.data.password.indexOf("This password is too short. It must contain at least %(min_length)d characters.") === 0) {
           setError(String("la nuova password è troppo corta"))
        }else if (error.response?.data.detail === "password not valid") {
            setError(String("la vecchia password non è valida"))
         }
      }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if(passwordData.newPassword != passwordData.confirmNewPassword){
        setError(String("la nuova password e conferma password non corrispondono"));
    }else{
         postUserData( passwordData )
        
    }
  };
  const paperStyle = { padding: 20, height: "70vh", width: 380, margin: "20px auto" };
  const avatarStyle = { backgroundColor: "blue" };
  const btnstyle = { margin: "20px 0" };
  

  return (
    <Grid component="form">
    <Paper elevation={10} style={paperStyle}>
      <Grid align="center">
        <Avatar style={avatarStyle}></Avatar>
        <h2>Cambia Password</h2>
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
          label="Vecchia Password"
          placeholder="inserisci nuova password"
          value={oldPassword}
          onChange={handleChange("oldPassword")}
          fullWidth
          type='password'
          required
        />
        <TextField
          label="Nuova Password"
          placeholder="inserisci nuova password"
          value={newPassword}
          onChange={handleChange("newPassword")}
          fullWidth
          type='password'
          required
        />
        <TextField
          label="Conferma password"
          placeholder="inserisci di nuovo la password"
          value={confirmNewPassword}
          onChange={handleChange("confirmNewPassword")}
          fullWidth          
          type='password'
          required
        />
      </Grid>
      <Button type="submit" color="primary" variant="contained" onClick={handleSubmit} style={btnstyle} fullWidth>
        Cambia password
      </Button>
    </Paper>
  </Grid>
  );
}

export default PasswordChange;
