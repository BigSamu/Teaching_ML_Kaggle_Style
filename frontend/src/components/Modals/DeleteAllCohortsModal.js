import React from 'react';
import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {deleteAllCohorts} from '../../redux/actions/cohort/cohortAction'

// *****************************************************************************
// A) Component Code
// *****************************************************************************

const DeleteAllCohortsModal = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Lifting State Variables from AdminMainTable component
  const {openModal, setOpenModal} = props; 

  // ii) Redux Hooks - Selectors and Dispatchers
  const dispatch = useDispatch()

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------
  
  const handleCloseOfModal = () => {
    setOpenModal({...openModal, deleteAllCohortsModal:false});
  }
  const handleDeleteCohort = () => {
    dispatch(deleteAllCohorts());
    setOpenModal({...openModal, deleteAllCohortsModal:false});
  }

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <Dialog open={openModal.deleteAllCohortsModal} onClose={handleCloseOfModal} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Delete Cohort</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Delete all Cohorts? All the information related to participants and their submitted models will be erased.
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

      
    </>
  )
}

export default DeleteAllCohortsModal
