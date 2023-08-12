import React from 'react'
import { Grid, Paper, Avatar, Typography, TextField, Button , 
Radio , RadioGroup , FormControlLabel , FormControl , FormLabel , Checkbox} from '@mui/material'


export default function Signup() {
    const paperStyle = { padding: '30px 20px', width: 500, margin: "20px auto" }
    const avatarStyle = { backgroundColor: 'blue' }
    const marginTop = { marginTop: 5 }
    const marginbottom = { marginbottom: 5 }
    return (
        <Grid>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                    </Avatar>
                    <h2 style={marginbottom}>Registrazione Istruttore</h2>
                </Grid>
                <form>
                    <Grid container rowGap={1}>
                    <TextField fullWidth label='Cognome' />
                    <TextField fullWidth label='Nome' />
                    <TextField fullWidth label='Email'/>
                    <TextField fullWidth label='Codice fiscale'/>
                    <TextField fullWidth label='Indirizzo palestra'/>
                    <FormControl component="fieldset" style={marginTop}>
                        <FormLabel component="legend">Sesso</FormLabel>
                        <RadioGroup aria-label="gender" name="gender" style={{ display: 'initial' }}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                        </RadioGroup>
                    </FormControl>
                    <TextField fullWidth label='Numero Cellulare' />
                    <TextField fullWidth label='Password' />
                    <TextField fullWidth label='Conferma Password'/>
                   
                    <Button style={marginTop} type='submit' variant='contained' color='primary'>Sign up</Button>
                    </Grid>
                </form>
            </Paper>
        </Grid>
    )
}
