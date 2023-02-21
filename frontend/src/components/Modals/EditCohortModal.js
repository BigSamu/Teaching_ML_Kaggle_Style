import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import {editCohort} from '../../redux/actions/cohort/cohortAction'

// *****************************************************************************
// A) Component Code
// *****************************************************************************

const EditCohortModal = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Lifting State Variables from AdminMainTable component
  const {cohortPk, openModal, setOpenModal} = props; 

  // ii) Cohort State Hook
  const [cohortDetails, setCohortDetails] = useState({
    name: '',
    is_active: ''
  })

  // iii) Redux Hooks - Selectors and Dispatchers
  const {cohorts} = useSelector(state =>  state.cohort)
  const dispatch = useDispatch()

  useEffect(() => {
    if(cohortPk){
      let id = cohorts.findIndex(cohort => cohort.pk === parseInt(cohortPk));
      let selectedCohort = cohorts[id];
      setCohortDetails({name:selectedCohort.name, is_active: selectedCohort.is_active})
    }
  },[cohortPk])


  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleCohortState = e => {
    setCohortDetails({...cohortDetails, [e.target.name]: e.target.value});
  }
  const handleCloseOfModal = () => {
    setOpenModal({...openModal, editCohortModal:false});
  }
  const handleRenameOfCohort = (e) => {
    let id = cohorts.findIndex(cohort => cohort.pk === parseInt(cohortPk));
    let selectedCohort = cohorts[id];
    selectedCohort.name = cohortDetails.name;
    dispatch(editCohort(selectedCohort));
    setOpenModal({...openModal, editCohortModal:false});
  }


  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={openModal.editCohortModal} onClose={handleCloseOfModal} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Cohort</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the new name for the cohort below:
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="New name:"
          name="name"
          value={cohortDetails.name}
          onChange={handleCohortState}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRenameOfCohort} variant="contained" color="primary">
          Rename
        </Button>
        <Button onClick={handleCloseOfModal} variant="outlined" color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditCohortModal
