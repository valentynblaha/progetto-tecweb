import React, { useState } from 'react';
import { Button, TextField,  Avatar, Paper,Grid, Alert } from "@mui/material";
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
        if (error.response?.status === 400) {
          switch (error.response.data.code) {
            case 1:
              setError("La vecchia password non è valida")
              break;
            case 2:
              setError("La nuova password deve essere diversa dalla vecchia")
              break;
            case 3:
              setError(<ul>{error.response.data.password.map((e, i) => <li key={i}>{e}</li>)}</ul>)
              break;
            default:
              setError(String(error))
          }
        } else {
          setError(String(error))
        }        
      }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if(passwordData.newPassword != passwordData.confirmNewPassword){
        setError(String("La nuova password e conferma password non corrispondono"));
    }else{
         postUserData( passwordData )
        
    }
  };
  const paperStyle = { padding: 20, height: "70vh", width: 380, margin: "20px auto" };
  const avatarStyle = { backgroundColor: "blue" };
  const btnstyle = { margin: "20px 0" };
  

  return (
    <Grid component="form" onSubmit={handleSubmit}>
    <Paper elevation={10} style={paperStyle}>
      <Grid align="center">
        <Avatar style={avatarStyle}></Avatar>
        <h2>Cambia Password</h2>
      </Grid>
      {error && (
        <Alert severity="error" sx={{my: 2}}>
        {error}
      </Alert>
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
      <Button type="submit" color="primary" variant="contained" style={btnstyle} fullWidth>
        Cambia password
      </Button>
    </Paper>
  </Grid>
  );
}

export default PasswordChange;
