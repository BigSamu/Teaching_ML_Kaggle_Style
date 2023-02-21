import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {authLogout} from '../../redux/actions/auth/authActions'

// *****************************************************************************
// A) Component Code
// *****************************************************************************

const LogoutModal = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Lifting state variables from NavBar component
  const {open, setOpen} = props; 

  // ii) Redux Hooks - Dispatchers
  const dispatch = useDispatch()

  // iii) React Routing Hooks - History
  let history = useHistory();

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------
  
  const handleCloseOfModal = () => {
      setOpen({...open, logoutModal:false});
  }
  const handleLogout = (e) => {
      dispatch(authLogout());
      setOpen({...open, logoutModal:false});
      history.push('/admin/');
  }


  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open.logoutModal} onClose={handleCloseOfModal} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Logging Out</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are  you sure you want to logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout} variant="contained" color="primary">
          Yes
        </Button>
        <Button onClick={handleCloseOfModal} variant="outlined" color="primary">
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LogoutModal
