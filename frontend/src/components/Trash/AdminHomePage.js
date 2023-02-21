import React, {useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';


import CompetitioResultsButton from '../Buttons/CompetitionResultsButton';
import AdminMainTable from '../Tables/AdminMainTable';
import AddCohortForm from '../Forms/AddCohortForm';

import CompetitionEnableDisableAllButtons from '../Buttons/CompetitionEnableDisableAllButtons';
import DeleteAllCohortsButton from '../Buttons/DeleteAllCohortsButton';

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles((theme) => ({
  mainContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 5, 2),
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

const AdminHomePage = () => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();

  // ii) React Hooks - States
  const [competition, setCompetition] = useState([
    { 
      name: 'competition_1',
      is_active: false
    },
    { 
      name: 'competition_2',
      is_active: false
    }
    ]
  )

  // ---------------------------------------------------------------------------
  // II) JSX
  // ---------------------------------------------------------------------------

  return (
      <>
        <div className={classes.mainContent}>
          <Container maxWidth="xl">
            <Typography
                className={classes.header}
                variant="h5"
                align="center" 
                color="textPrimary" 
                gutterBottom
              >
                Admin Dashboard
            </Typography>
            <Divider/>
            
            <Box pt={2}>
              <Grid container>
                <Grid item xs={12} md={5} >
                  <AddCohortForm/>
                </Grid>            
                <Grid item xs={12} md={7}>
                  <CompetitioResultsButton competition={competition} setCompetition={setCompetition}/>
                </Grid>
              </Grid> 
            </Box>

            <AdminMainTable/>
            
            <Box pt={1}>
              <Grid container justify = "space-between">
                <Grid item xs={12} md={6} >
                  <CompetitionEnableDisableAllButtons competition={competition} setCompetition={setCompetition}/>
                </Grid>            
                <Grid item xs={12} md={6}>
                  <DeleteAllCohortsButton/>
                </Grid>
              </Grid>
            </Box>
            
          </Container>
        </div>
      </>
  )
}
export default AdminHomePage;