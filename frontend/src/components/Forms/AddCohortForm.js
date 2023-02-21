import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import LibraryAddIcon from '@material-ui/icons/LibraryAdd';

import {addCohort} from '../../redux/actions/cohort/cohortAction'

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles(theme => ({
    button: {
      backgroundColor: theme.palette.success.main,
      '&:hover': {
          background: theme.palette.success.dark,
        },
      color: theme.palette.common.white,
      fontSize: 14,
      fontWeight: 600,
      padding: theme.spacing(1,3)
    },
    form: {
      width: '100%', // FixS IE 11 issue.
      margin: theme.spacing(1,2),
    },
    errorMessage: {
      color: "red"
    }
  }));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

export function AddCohortForm() {
  
  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();
  
  // ii) React Hooks - States
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
  const [cohort, setCohort] = useState({
      name: '',
      is_active: false,
      competition_1_access: false,
      competition_2_access: false
  })
  
  // iii) Redux Hooks - Dispatchers
  const dispatch = useDispatch();

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleCohortState = e => {
    setCohort({...cohort, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cohort.name == "") {
      setDisplayErrorMessage(true);
    } else {
      dispatch(addCohort(cohort));
      setCohort({...cohort,name:''})
      setDisplayErrorMessage(false);
    }
  
  };

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <Grid container>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid item container xs={8} spacing ={1}>
            <Grid item >
                <Box mb={1}>
                <Box fontWeight="fontWeightBold">Add Cohort</Box>
                </Box>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={10}>
                
                  <TextField 
                    required
                    fullWidth 
                    id="addCohort"
                    label="Cohort Name"
                    name="name"
                    size="small" 
                    variant="outlined"
                    value={cohort.name}
                    onChange={handleCohortState}
                  />
                  {
                  (displayErrorMessage === true) && 
                    <small className={classes.errorMessage}>
                    Please insert a cohort name in order to create a cohort</small>
                  }
              </Grid>
              <Grid item xs={2}>
                  <Button
                    startIcon={<LibraryAddIcon /> }
                    variant="contained" 
                    className={classes.button} 
                    onClick={handleSubmit} 
                  >
                    Add
                  </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </>
  );
}

export default AddCohortForm;

