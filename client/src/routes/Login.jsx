import React from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography,Link } from '@mui/material'
import api from "../api/api";


async function postUserData(email,password){
   params = {email: email , password: password}
   const responce = await api.post('  ',params)
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
  const btnstyle={margin:'8px 0'}
  return(
      <Grid>
          <Paper elevation={10} style={paperStyle}>
              <Grid align='center'>
                   <Avatar style={avatarStyle}></Avatar>
                  <h2>Sign In</h2>
              </Grid>
              <TextField label='Email' placeholder='Enter Email' value={email} onChange={handleChange("email")} fullWidth required/>
              <TextField label='Password' placeholder='Enter password' type='password' value={password} onChange={handleChange("password")} fullWidth required/>  
              <Button type='submit' color='primary' variant="contained" onClick={handleSubmit} style={btnstyle} fullWidth>Sign in</Button>
              <Typography > Sei nuovo su Fitcourse? 
                   <Link href="/signup" underline='none' >
                      {' '} iscriviti
                   </Link>
              </Typography>
          </Paper>
      </Grid>
  )

}
