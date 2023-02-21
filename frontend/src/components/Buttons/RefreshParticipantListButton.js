import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import RefreshIcon from '@material-ui/icons/Refresh';

import {getAllClients} from '../../redux/actions/client/clientAction'

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles((theme) => ({
  
  button: {
    
    backgroundColor: theme.palette.success.main,
        '&:hover': {
            background: theme.palette.success.dark,
         },
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: 600,
    }
  }));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const RefreshParticipantListButton = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------
  
  // i) Material UI Hooks
  const classes = useStyles();

  // ii) Lifting state variables from CompetitionOneResutlsPage component
  const {isRefreshingList, setIsRefreshingList} = props;

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleRefreshClientList = () => {
    setIsRefreshingList(true)
  }
  
  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <Box display ='flex' justifyContent="flex-end">
        <Box m={1}>
          <Button 
            startIcon={<RefreshIcon />}
            variant="contained" 
            className={classes.button} 
            onClick={handleRefreshClientList}
          >
            Refresh Participant List
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default RefreshParticipantListButton
