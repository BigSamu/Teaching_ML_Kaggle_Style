
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import LandingPageForm from "../Forms/LandingPageForm";

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

const ClientLandingPage = () => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();


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
            <Box align="center" >
                <Grid container spacing={3} justify="center" alignItems="center">
                  <Grid item xs={5}>
                    <LandingPageForm/> 
                  </Grid>
                  <Grid item xs={5}>
                    <Box>
                      <LandingPageLogo style={{ width: '25rem', height: 'auto'}}/>
                    </Box>
                  </Grid>
                </Grid>
            </Box>
              
          </Container>
        </div>
      </main>
    </>
  );
} 

export default ClientLandingPage;