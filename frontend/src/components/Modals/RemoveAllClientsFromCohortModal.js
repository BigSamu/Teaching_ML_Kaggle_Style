import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import _ from "lodash";

import {deleteAllClientsFromCohort} from '../../redux/actions/client/clientAction'

// *****************************************************************************
// A) Component Code
// *****************************************************************************

const RemoveAllClientsFromCohortModal = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Lifting State Variables for EditCohortModal component
  const {cohortPk, openModal, setOpenModal} = props; 

  // iii) Redux Hooks - Dispatchers            
  const dispatch = useDispatch();
  const {cohorts} = useSelector(state =>  state.cohort);


  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleCloseOfModal = () => {
    setOpenModal({...openModal, removeAllClientsFromCohortModal:false});
  }
  const handleRemoveAllClientsFromCohort = (e) => {
    let id = cohorts.findIndex(cohort => cohort.pk === parseInt(cohortPk));
    let selectedCohort = cohorts[id];
    dispatch(deleteAllClientsFromCohort(selectedCohort))
    setOpenModal({...openModal, removeAllClientsFromCohortModal:false});
  }


  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={openModal.removeAllClientsFromCohortModal} onClose={handleCloseOfModal} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Delete All Participants</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are  you sure you want to remove all participants from this Cohort?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRemoveAllClientsFromCohort} variant="contained" color="primary">
          Yes
        </Button>
        <Button onClick={handleCloseOfModal} variant="outlined" color="primary">
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RemoveAllClientsFromCohortModal
