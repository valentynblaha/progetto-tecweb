import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Paper, Avatar, Typography, TextField, Button , 
Radio , RadioGroup , FormControlLabel , FormControl , FormLabel , Checkbox} from '@mui/material'
import MuiFileInput from "../utils/MuiFileInput";


export default function Signup() {
    const [values, setValues] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        gender: ""
      });   

    const [success, setSuccess] = useState(false)
    const { email, password, first_name, last_name, phone} = values;

    const paperStyle = { padding: '30px 20px', width: 400, margin: "20px auto" }
    const avatarStyle = { backgroundColor: 'blue' }
    const marginTop = { marginTop: 5 }
    const marginbottom = { marginbottom: 5 }
    const postUserData = async({values}) => {
        const response = await api.post("api/course/register_user/", { values});
        return response
    }


    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
      };
    
    const handleSubmit = () => {
      //  response = postUserData({values})
        //if(response){
        setSuccess(true)
     };
    return (success ? <div style={{ textAlign: 'center', marginTop: '100px' }}>
                            <Typography variant='h5'>Registrazione utente è avvenuta con successo</Typography>
                            <Button style= {{ margin: "20px 0 10px 0" }} href="/login" variant='contained' color='primary' >
                                     Vai al Login
                            </Button>
                       </div> :
        <Grid>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                    </Avatar>
                    <h2 style={marginbottom}>Registrazione User</h2>
                </Grid>
                <form>
                    <Grid container rowGap={1}>
                    <TextField fullWidth label='Cognome' value={last_name} onChange={handleChange('last_name')}/>
                    <TextField fullWidth label='Nome' value={first_name} onChange={handleChange('first_name')} />
                    <TextField fullWidth label='Email' value={email} onChange={handleChange('email')}/>
                    <FormControl component="fieldset" style={marginTop}>
                        <FormLabel component="legend">Sesso</FormLabel>
                        <RadioGroup aria-label="gender" name="gender" style={{ display: 'initial' }}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" onChange={handleChange('gender')}/>
                            <FormControlLabel value="male" control={<Radio />} label="Male" onChange={handleChange('gender')} />
                        </RadioGroup>
                    </FormControl>
                    <TextField fullWidth label='Numero Cellulare' value={phone} onChange={handleChange('phone')} />
                    <TextField fullWidth label='Password' type='password' value={password} onChange={handleChange('password')}/>
                    <TextField fullWidth label='Conferma Password' type='password'/>
                    <MuiFileInput
            accept="image/*"
            id="ecommerce-image"
            url="api/ecommerce/upload/"
            style={{ width: "50px", height: "50px" }}
          >
            Carica immagine
          </MuiFileInput>
                    <FormControlLabel
                        control={<Checkbox name="checkedA" />}
                        label="I accept the terms and conditions."
                    />
                    <Button type='submit' onClick={handleSubmit} variant='contained' color='primary'>Sign up</Button>
                    </Grid>
                </form>
               
            </Paper>
            
        </Grid>
        
    )
}
