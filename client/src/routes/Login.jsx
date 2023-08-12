import React, {useState} from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography,Link } from '@mui/material'
import api from "../api/api";


async function postUserData(email, password){
   const response = await api.post('api/user/token/', {email, password})
   console.log(response.data)
}

export default function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const {email,password} = values

  const handleChange = (name) =>
    (event) => {
      setValues({ ...values, [name]: event.target.value });
    };

  const handleSubmit = (event) => {
      event.preventDefault();
      postUserData(email,password);
       
    };


  const paperStyle={padding :20,height:'70vh',width:380, margin:"20px auto"}
  const avatarStyle={backgroundColor:'blue'}
  const btnstyle={margin:'20px 0'}
  const btnstyle2={margin:'20px 0 10px 0'}
  return(
      <Grid >
          <Paper elevation={10} style={paperStyle}>
              <Grid align='center'>
                   <Avatar style={avatarStyle}></Avatar>
                  <h2>Sign In</h2>
              </Grid>
              <Grid container rowGap={1}>
              <TextField label='Email' placeholder='Enter Email' value={email} onChange={handleChange("email")} fullWidth required/>
              <TextField label='Password' placeholder='Enter password' type='password' value={password} onChange={handleChange("password")} fullWidth required/>
              </Grid> 
              <Button type='submit' color='primary' variant="contained" onClick={handleSubmit} style={btnstyle} fullWidth>Sign in</Button>
              <Typography align='center'> Sei nuovo su Fitcourse?</Typography>
              <Button variant="outlined" align='center' style={btnstyle2} fullWidth href="/signup/user">registrati come utente</Button>
              <Button variant="outlined" align='center' fullWidth href="/signup/instructor">registrati come istruttore</Button> 
          </Paper>
      </Grid>
  )

}


// <Link href="/signup" underline='none' >
//{' '} iscriviti
//</Link>
