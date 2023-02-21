import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useHistory } from "react-router";

import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import {getPrivateKey} from '../../utils/utils'

import {getAllCohorts} from '../../redux/actions/cohort/cohortAction';
import {getAllClients} from '../../redux/actions/client/clientAction';

import _ from "lodash";

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles((theme) => ({
  button: {
    maxWidth: theme.spacing(30), 
  }
}));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const CompetitionSelectionButtons = (props) => {
  
  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------
  
  // i) Material UI Hooks
  const classes = useStyles();

  // ii) Lifting state variables from App component, through Routes component, 
  // throught Client Landing Page Component
  const {isClientLoggedIn, setIsClientLoggedIn} = props

  // ii) Auxiliar Variable for holding current Uuer saved in local storage
  const currentClient = JSON.parse(localStorage.getItem('client'))
 
  // ii) React Hooks - States
  const [currentCohort, setCurrentCohort] = useState({})
  const [competitionSelected, setCompetitionSelected] = useState('')

  // iii) Redux Hooks - Selectors and Dispatchers
  const {cohorts} = useSelector(state =>  state.cohort)
  const {clients} = useSelector(state =>  state.client);
  const dispatch = useDispatch();

  // iv) React Routing Hooks - History
  const history = useHistory();

  // v) React Hooks - Effects
  useEffect(() => {
    // Call getAllCohorts at the beggining
    dispatch(getAllClients())
    dispatch(getAllCohorts())

    // Call getAllCohorts() every 1 second
    const interval=setInterval(()=>{
      dispatch(getAllCohorts())
     },1000)    
     return()=>clearInterval(interval)
  },[])


  useEffect(() => {
    if(!_.isEmpty(cohorts))
      handleCheckSelectedCohort()
  },[cohorts])

  useEffect(() => {
    if(!_.isEmpty(competitionSelected)){
      let currentClientUsername = JSON.parse(localStorage.getItem('client')).username
      const id = clients.findIndex(client => client.username === currentClientUsername);
      if(id === -1){
        localStorage.removeItem('client');
        setIsClientLoggedIn(false);
        alert("Participant not authenticated");
      }
      else{
        history.push("/"+competitionSelected);
      }     
    }
  },[clients])

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------


  const handleCompetitionSelection = (e) => {

    setCompetitionSelected(e.currentTarget.value);
    dispatch(getAllClients());      
    
  }

  const handleCheckSelectedCohort = () => {
    
    let pk = getPrivateKey(currentClient.cohort)
    let id = cohorts.findIndex(cohort => cohort.pk === parseInt(pk));
    let selectedCohort = cohorts[id];
    setCurrentCohort({...selectedCohort});
  }


  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
        <Box width="70%" mx="auto" mb={4}>
            <Typography 
              variant="h4" 
              align="center" 
              color="textSecondary" 
              paragraph
            >
              Welcome {currentClient.first_name}
          </Typography>
        </Box>
        <Grid container spacing={3} justify="center" alignItems="center" style={{"marginBottom":"8rem"}}>
          <Grid item xs={6} align="right">
            <Button 
            
              className = {classes.button}
              variant = "contained"
              color = "primary"
              name = "name"
              value = "competition_1"
              onClick={handleCompetitionSelection}
              disabled ={!currentCohort.competition_1_access}
            > <Box mx={3} my={1}>
                Participate in Competition 1
              </Box>
            </Button>
          </Grid>
          <Grid item xs={6} align="left">
            <Button 

              className = {classes.button}
              variant = "contained"
              color = "primary"
              name = "name"
              value = "competition_2"
              onClick={handleCompetitionSelection}
              disabled ={!currentCohort.competition_2_access}
            >
              <Box mx={3} my={1}>
                Participate in Competition 2
              </Box>
            </Button>
          </Grid>
        </Grid>
    </>
  );
}

export default CompetitionSelectionButtons;