import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useHistory} from "react-router-dom";

import {makeStyles} from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import * as config from '../../config/config';
import _ from "lodash";

import {getAllCohorts} from '../../redux/actions/cohort/cohortAction';
import {addClient, getAllClients} from '../../redux/actions/client/clientAction';

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(10),
    display: 'flex',
    flexDirection: '',
    alignItems: 'center',
  },
  form: {
    width: '100%', // FixS IE 11 issue.
    marginTop: theme.spacing(1),
  },
  formControl: {
    width: '100%',
  },
  button: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const LandingPageForm = (props) => {
  
  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------
  
  // i) Material UI Hooks
  const classes = useStyles();

  // ii) Lifting state variables from App component, through Routes and ClientLandingPage component
  const {isClientLoggedIn, setIsClientLoggedIn} = props;

   // iii) React Hooks - States
  const [clientDetails, setClientDetails] = useState({
    first_name: '',
    last_name: '',
    username:'',
    cohort:''
  })

  // iv) Redux Hooks - Selectors and Dispatchers
  const {cohorts} = useSelector(state =>  state.cohort)
  const dispatch = useDispatch()

  // v) React Routing Hooks - History and Location
  let history = useHistory();

  // vi) React Hooks - Effects
  useEffect(() => {

    // Call getAllCohorts at the beginning
    dispatch(getAllCohorts())
    dispatch(getAllClients())

    // Call getAllCohorts() every 60 seconds* (from 1 second)
    const interval=setInterval(()=>{
      dispatch(getAllCohorts())
      dispatch(getAllClients())
     },60000)    
     return()=>clearInterval(interval)
  },[])

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleFormFieldChange = (e) => {

    setClientDetails({...clientDetails, [e.target.name]: e.target.value})
  }


  const handleSubmit = (e) => {
    e.preventDefault();
   
    let uniqueId = clientDetails.first_name + clientDetails.last_name + Math.floor((Math.random() * 100) + 1)
    let clientData = {
      first_name: clientDetails.first_name,
      last_name: clientDetails.last_name,
      username:uniqueId,
      cohort:clientDetails.cohort
    }

    dispatch(addClient(clientData))
    localStorage.setItem('client',JSON.stringify(clientData))
    setIsClientLoggedIn(true)
    history.push('/')
  }

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box>
            <Typography 
              variant="h5" 
              align="center" 
              color="textSecondary" 
              paragraph
            >
              A fun way and easy way to learn Machine Learning!
          </Typography>
        </Box>
        <Box py={1}>
          <Box>
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="First name"
                    name="first_name"
                    autoComplete="given-name"
                    value={clientDetails.first_name}
                    onChange={handleFormFieldChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last name"
                    name="last_name"
                    autoComplete="given-name"
                    value={clientDetails.last_name}
                    onChange={handleFormFieldChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Cohort</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      required
                      fullWidth
                      id="cohort"
                      label="Cohort"
                      name="cohort"
                      value={clientDetails.cohort} 
                      onChange={handleFormFieldChange}
                    > 
                    
                      {
                        (!_.isEmpty(cohorts)) 
                        ?
                        cohorts.filter(item => (item.competition_1_access || item.competition_2_access)).map((item, index) =>
                          <MenuItem 
                            key={index}
                            value = {`${config.API_SERVER}/classroom/cohort/${item.pk}/`}
                          >
                            {item.name}
                          </MenuItem>
                          
                        )
                        :
                          <MenuItem 
                            value="" 
                            disabled
                          >
                            No Cohort Enabled
                          </MenuItem>
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid container spacing={4} justify="center">
                  <Grid item xs={12}>
                    <Button 
                      className={classes.button}
                      variant="contained" 
                      color="primary"
                      type="submit"
                      size = "large"
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default LandingPageForm;
