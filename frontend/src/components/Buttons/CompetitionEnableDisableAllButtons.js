import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import _ from "lodash";

import {getAllCohorts, enableAccessCompetitionInAllCohorts, 
        disableAccessCompetitionInAllCohorts} 
      from '../../redux/actions/cohort/cohortAction'


// *****************************************************************************
// A) Component Code
// *****************************************************************************

const CompetitionEnableDisableAllButtons = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------
 
  // i) Redux Hooks - Selectors and Dispatchers
  const {cohorts} = useSelector(state =>  state.cohort);
  const dispatch = useDispatch(); 


  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleEnableDisableCompetitionOneInAllCohorts = (e) => {
  
    if(!cohorts[0].competition_1_access){  
      dispatch(enableAccessCompetitionInAllCohorts('competition_1'))
    }
    else{
      dispatch(disableAccessCompetitionInAllCohorts('competition_1'))
    }
    
  }

  const handleEnableDisableCompetitionTwoInAllCohorts = (e) => {
    if(!cohorts[0].competition_2_access){
      dispatch(enableAccessCompetitionInAllCohorts('competition_2'))
    }
    else{
      dispatch(disableAccessCompetitionInAllCohorts('competition_2'))
    }
  }

  useEffect(() => {
    dispatch(getAllCohorts())
  },[]) 

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <Box display="flex" justifyContent= "flex-start" alignItems="center">
        <Typography component="div">
          <Box fontWeight="fontWeightBold">Enable/Disable</Box>
        </Typography>
        <Box mx={2}>
          <ButtonGroup variant="text" color="primary">
            <Button 
              onClick={handleEnableDisableCompetitionOneInAllCohorts}
            >
              All Competition 1
            </Button>
            <Button 
              onClick={handleEnableDisableCompetitionTwoInAllCohorts}
            >
              All Competition 2
            </Button>
          </ButtonGroup>
        </Box>
      </Box>          
    </>
  )
}

export default CompetitionEnableDisableAllButtons
