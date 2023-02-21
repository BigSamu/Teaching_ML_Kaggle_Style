
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';


import SelectCompetitionButtons from "../Buttons/SelectCompetitionButons";

import {ReactComponent as AILogo} from "../../src/img/artificialIntelligenceLogo.svg"


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

const ClientHomePage = () => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();

  // // iii) React Hooks - Effects
  // useEffect(() => {
    
  //   // Call handleCheckCurrentClient() at beggining
  //   handleCheckCurrentClient()
  //   // Call handleCheckCurrentClient() every 0.1 second
  //   const interval=setInterval(()=>{
  //     handleCheckCurrentClient()
  //    },100)    
  //    return()=>clearInterval(interval)
  // },[])


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
            <Box mt={-2} align="center">
              <SelectCompetitionButtons/>
              <Box mt={6}>
              <AILogo style={{ width: '30rem', height: 'auto'}}/>
              </Box>
            </Box>
            
          </Container>
        </div>
      </main>
    </>
  );
} 

export default ClientHomePage;