import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import LandingPageForm from "../components/Forms/LandingPageForm";
import CompetitionSelectionButtons from "../components/Buttons/CompetitionSelectionButtons";

import {ReactComponent as AILogo} from "../../src/img/artificialIntelligenceLogo.svg"
import {ReactComponent as LandingPageLogo} from "../../src/img/landingPageLogo.svg"


// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
  },
}));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const ClientLandingPage = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();

  // ii) Lifting state variables from App component, through Routes component
  const {isClientLoggedIn, setIsClientLoggedIn} = props;

  // ii) React Hooks - States
  const [clientSuscribed, setClientSuscribed] = useState(false);

  // iii) React Hooks - Effects
  useEffect(() => {
    
    // // Call handleCheckCurrentClient() at beggining
    // handleCheckCurrentClient()
    // // Call handleCheckCurrentClient() every 0.1 second
    // const interval=setInterval(()=>{
    //   handleCheckCurrentClient()
    //  },100)    
    //  return()=>clearInterval(interval)
  },[])

  /// ---------------------------------------------------------------------------
  // I) Handlers
  // ---------------------------------------------------------------------------

  // const handleCheckCurrentClient = () => {
  //   let client = JSON.parse(localStorage.getItem('client'))
  //   if(client)
  //     setClientSuscribed(true)
  //   else
  //     setClientSuscribed(false)
  // }

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="xl">

            <Box mb={6}>
              <Typography 
                component="h1" 
                variant="h2" 
                align="center" 
                color="textPrimary" 
                gutterBottom = {true}
              >
                <Box maxWidth='50%' mx="auto">
                  Welcome to Imperial Machine Learning!
                </Box>
              </Typography>
            </Box>

           { !isClientLoggedIn ? 
            
              <Box align="center" >
                  <Grid container spacing={3} justify="center" alignItems="center">
                    <Grid item xs={5}>
                      <LandingPageForm 
                        isClientLoggedIn = {isClientLoggedIn}
                        setIsClientLoggedIn = {setIsClientLoggedIn}
                      /> 
                    </Grid>
                    <Grid item xs={5}>
                      <Box>
                        <LandingPageLogo style={{ width: '25rem', height: 'auto'}}/>
                      </Box>
                    </Grid>
                  </Grid>
              </Box>
              :
              <Box mt={-2} align="center">
                <CompetitionSelectionButtons
                  isClientLoggedIn = {isClientLoggedIn}
                  setIsClientLoggedIn = {setIsClientLoggedIn}
                />
                <Box mt={6}>
                  <AILogo style={{ width: '30rem', height: 'auto'}}/>
                </Box>
              </Box>
            }
          </Container>
        </div>
      </main>
    </>
  );
} 

export default ClientLandingPage;