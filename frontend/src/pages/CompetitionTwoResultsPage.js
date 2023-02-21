import React, {useState} from 'react';

//import MaterialUI components
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import CompetitionTwoResultsTable from '../components/Tables/CompetitionTwoResultsTable'
import SelectCohortInputLabel from '../components/InputLabels/SelectCohortInputLabel'
import RefreshParticipantListButton from '../components/Buttons/RefreshParticipantListButton'


import {getAllClients} from '../redux/actions/client/clientAction'

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

const useStyles = makeStyles((theme) => ({
  mainContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 5, 2),
  },  
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(10),
    display: 'flex',
    flexDirection: '',
    alignItems: 'center',
  },
  header:{
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    fontWeight: 600,
  }
  }));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const CompetitionTwoResultsPage = () => {
    
  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();
  
  // ii) React Hooks - States
  const [currentCohort, setCurrentCohort] = useState({});
  const [isRefreshingList, setIsRefreshingList] = useState(false);


  // ---------------------------------------------------------------------------
  // II) JSX
  // ---------------------------------------------------------------------------

  return (
    <div className={classes.mainContent}>
      <Container maxWidth="xl">
       
      <Typography
        className={classes.header}
        variant="h5"
        align="center" 
        color="textPrimary" 
        gutterBottom = {true}
      >
        Competition 2 Results
      </Typography>
      <Divider />

      <Grid container justify = "center" alignItems="flex-end">
        <Grid item xs={5}>
          <SelectCohortInputLabel
            currentCompetition ={"competition_1"} 
            currentCohort={currentCohort} 
            setCurrentCohort={setCurrentCohort}
          />
        </Grid>
        <Grid item xs={7}>
          <RefreshParticipantListButton
            isRefreshingList={isRefreshingList} 
            setIsRefreshingList={setIsRefreshingList}
          />
        </Grid>
      </Grid>
      
      <Grid container justify="center">
          <CompetitionTwoResultsTable
            isRefreshingList={isRefreshingList}
            setIsRefreshingList={setIsRefreshingList}
            currentCohort={currentCohort} 
            setCurrentCohort={setCurrentCohort} 
        />
      </Grid>
    </Container>
    </div>
  )
}
export default CompetitionTwoResultsPage;
