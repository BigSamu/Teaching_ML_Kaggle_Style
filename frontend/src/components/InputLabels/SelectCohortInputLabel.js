import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import * as config from '../../config/config';
import _ from "lodash";


import {getAllCohorts, saveCohort} from '../../redux/actions/cohort/cohortAction'

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 250,
    },
  }));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

export function SelectCohortInputLabel(props) {
  
  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();
  
  // ii) Lifting state variables from CompetitionOneResutlsPage component
  const {currentCompetition, currentCohort, setCurrentCohort} = props;

  // iii) Redux Hooks - Selectors and Dispatchers
  const {cohorts, savedCohort} = useSelector(state =>  state.cohort);
  
  const dispatch = useDispatch();
  const cohortsForCompetition = ((currentCompetition === 'competition_1') ? 
                                cohorts.filter(item => item.competition_1_access) :
                                cohorts.filter(item => item.competition_2_access) );

  // iv)  React Hooks - Effects
  useEffect(() => {
    dispatch(getAllCohorts());
  },[])

  useEffect(() => {
    if(!_.isEmpty(savedCohort.competition_1) && 
      currentCompetition === 'competition_1')
        setCurrentCohort(savedCohort.competition_1)
    else if(!_.isEmpty(savedCohort.competition_2) && 
      currentCompetition === 'competition_2')
        setCurrentCohort(savedCohort.competition_2)
    else if(cohortsForCompetition[0])
      setCurrentCohort(cohortsForCompetition[0])

  },[cohortsForCompetition])

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleCohortSelection = (e) => {
    let pk = e.target.value
    let id = cohortsForCompetition.findIndex(cohort => cohort.pk === parseInt(pk));
    let selectedCohort = cohortsForCompetition[id];
    setCurrentCohort({...selectedCohort});
    dispatch(saveCohort(selectedCohort))
  }

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <Box mt={3} display="flex" alignItems="center">
        <Typography component="div"> 
          <Box mt={2} fontWeight="fontWeightBold">Select Cohort</Box>
        </Typography>
        <Box ml={3}>
          <FormControl variant = 'standard' className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Cohort</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              required
              fullWidth
              id="cohort"
              label="Cohort"
              value = {currentCohort.pk || ''}
              onChange={handleCohortSelection}
            > 
              {
                (!!cohortsForCompetition.length)
                ?
                cohortsForCompetition.map((item, index) =>
                  <MenuItem 
                    key={index} 
                    value = {item.pk}
                  >
                    {item.name}
                  </MenuItem>
                )
                :
                  <MenuItem 
                  value= "" 
                  disabled
                  >
                  No Competition Enabled
                  </MenuItem>
              }
            </Select>
          </FormControl>
        </Box>
      </Box>
    </>
  );
}

export default SelectCohortInputLabel;
