import React , {useState} from 'react'
import { Grid, Paper, Avatar, Typography, TextField, Button , 
Radio , RadioGroup , FormControlLabel , FormControl , FormLabel , Checkbox} from '@mui/material'

export default function Signup() {
    const [values, setValues] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        gender: "",
        cod_fisc: "",
        gym_address: ""
      });   
    const [success, setSuccess] = useState(false)
    const { email, password, first_name, last_name, phone , cod_fisc, gym_address } = values;
    const paperStyle = { padding: '30px 20px', width: 500, margin: "20px auto" }
    const avatarStyle = { backgroundColor: 'blue' }
    const marginTop = { marginTop: 5 }
    const marginbottom = { marginbottom: 5 }

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
      };
    const postUserData = async({values}) => {
        const response = await api.post("api/course/register_user/", { values});
        return response
    }
    const handleSubmit = () => {
        //  response = postUserData({values})
          //if(response){
          setSuccess(true)
       };
    return (success ? <div style={{ textAlign: 'center', marginTop: '100px' }}>
                            <Typography variant='h5'>Registrazione istruttore è avvenuta con successo</Typography>
                            <Button style= {{ margin: "20px 0 10px 0" }} href="/login" variant='contained' color='primary' >
                                     Vai al Login
                            </Button>
                       </div> :
          <Grid>
             <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                    </Avatar>
                    <h2 style={marginbottom}>Registrazione Istruttore</h2>
                </Grid>
                <form>
                    <Grid container rowGap={1}>
                    <TextField fullWidth label='Cognome' value={last_name} onChange={handleChange('last_name')} />
                    <TextField fullWidth label='Nome'  value={first_name} onChange={handleChange('first_name')} />
                    <TextField fullWidth label='Email'value={email} onChange={handleChange('email')} />
                    <TextField fullWidth label='Codice fiscale' value={cod_fisc} onChange={handleChange('cod_fisc')}/>
                    <TextField fullWidth label='Indirizzo palestra' value={gym_address} onChange={handleChange('gym_address')}/>
                    <FormControl component="fieldset" style={marginTop}>
                        <FormLabel component="legend">Sesso</FormLabel>
                        <RadioGroup aria-label="gender" name="gender" style={{ display: 'initial' }}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                        </RadioGroup>
                    </FormControl>
                    <TextField fullWidth label='Numero Cellulare'  value={phone} onChange={handleChange('phone')} />
                    <TextField fullWidth label='Password' value={password} onChange={handleChange('password')} />
                    <TextField fullWidth label='Conferma Password'/>
                    <Button style={marginTop} type='submit' variant='contained' onClick={handleSubmit} color='primary'>Sign up</Button>
                    </Grid>
                </form>
            </Paper>
        </Grid>
    )
}
