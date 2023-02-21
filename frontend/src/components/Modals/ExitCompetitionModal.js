import React from 'react';
import {useHistory} from "react-router-dom";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// *****************************************************************************
// A) Component Code
// *****************************************************************************

const ExitCompetitionModal = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Lifting state variables from NavBar component
  const {open, setOpen} = props; 

  // ii) React Routing Hooks - History
  let history = useHistory();

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  
  const handleCloseOfModal = () => {
      setOpen({...open, exitCompetitionModal:false});
  }
  const handleExitCompetition = (e) => {
      history.push('/')
      setOpen({...open, exitCompetitionModal:false});
  }


  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open.exitCompetitionModal} onClose={handleCloseOfModal} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Exit Competition</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are  you sure you want to exit the competition?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleExitCompetition} variant="contained" color="primary">
          Yes
        </Button>
        <Button onClick={handleCloseOfModal} variant="outlined" color="primary">
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExitCompetitionModal
