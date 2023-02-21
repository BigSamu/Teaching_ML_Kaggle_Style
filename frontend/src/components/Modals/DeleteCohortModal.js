import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {deleteCohort} from '../../redux/actions/cohort/cohortAction'

// *****************************************************************************
// A) Component Code
// *****************************************************************************

const DeleteCohortModal = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Lifting State Variables from AdminMainTable component
  const {cohortPk, openModal, setOpenModal} = props; 

  // ii) Redux Hooks - Selectors and Dispatchers
  const {cohorts} = useSelector(state =>  state.cohort)
  const dispatch = useDispatch()

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------
  
  const handleCloseOfModal = () => {
    setOpenModal({...openModal, deleteCohortModal:false});
  }
  const handleDeleteCohort = (e) => {
    let id = cohorts.findIndex(cohort => cohort.pk === parseInt(cohortPk));
    let selectedCohort = cohorts[id];
    dispatch(deleteCohort(selectedCohort));
    setOpenModal({...openModal, deleteCohortModal:false});
  }

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={openModal.deleteCohortModal} onClose={handleCloseOfModal} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Delete Cohort</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to Delete this Cohort? All the information related to its participants and their submitted models will be erased.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteCohort} variant="contained" color="primary">
          Yes
        </Button>
        <Button onClick={handleCloseOfModal} variant="outlined" color="primary">
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteCohortModal
