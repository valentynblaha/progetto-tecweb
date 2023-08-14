import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Paper, Avatar, Typography, TextField, Button , 
Radio , RadioGroup , FormControlLabel , FormControl , FormLabel , Checkbox} from '@mui/material'


export default function Signup() {
    const [success, setSuccess] = useState(false)
    const performRedirect = () => {
        setSuccess(true)
     };
    const paperStyle = { padding: '30px 20px', width: 400, margin: "20px auto" }
    const avatarStyle = { backgroundColor: 'blue' }
    const marginTop = { marginTop: 5 }
    const marginbottom = { marginbottom: 5 }
    return (success ? <div>Great<Link to="/login">Vai al login</Link></div> :
        <Grid>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                    </Avatar>
                    <h2 style={marginbottom}>Registrazione User</h2>
                </Grid>
                <form>
                    <Grid container rowGap={1}>
                    <TextField fullWidth label='Cognome' />
                    <TextField fullWidth label='Nome' />
                    <TextField fullWidth label='Email'/>
                    <FormControl component="fieldset" style={marginTop}>
                        <FormLabel component="legend">Sesso</FormLabel>
                        <RadioGroup aria-label="gender" name="gender" style={{ display: 'initial' }}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                        </RadioGroup>
                    </FormControl>
                    <TextField fullWidth label='Numero Cellulare' />
                    <TextField fullWidth label='Password' type='password' />
                    <TextField fullWidth label='Conferma Password' type='password'/>
                    <FormControlLabel
                        control={<Checkbox name="checkedA" />}
                        label="I accept the terms and conditions."
                    />
                    <Button type='submit' onClick={performRedirect} variant='contained' color='primary'>Sign up</Button>
                    </Grid>
                </form>
               
            </Paper>
            
        </Grid>
        
    )
}
