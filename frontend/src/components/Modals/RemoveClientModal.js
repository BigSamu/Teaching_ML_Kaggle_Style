import React from 'react';
import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {deleteClient} from '../../redux/actions/client/clientAction'

// *****************************************************************************
// A) Component Code
// *****************************************************************************

const DeleteClientModal = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Lifting State Variables from AdminMainTable component
  const {clientPk, clientsInCohort, setClientsInCohort, open, setOpen} = props; 
  
  // ii) Redux Hooks - Dispatchers
  const dispatch = useDispatch()

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  
  const handleCloseOfModal = () => {
    setOpen({...open, deleteClientModal:false});
  }
  const handleDeleteClient = (e) => {
    
    let id = clientsInCohort.findIndex(client => client.pk === parseInt(clientPk));
    let selectedClient = clientsInCohort[id];
    setClientsInCohort(clientsInCohort.filter(client => client.pk !== parseInt(clientPk)));
    
    dispatch(deleteClient(selectedClient));
    setOpen({...open, deleteClientModal:false});
  }


  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open.deleteClientModal} onClose={handleCloseOfModal} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Delete Participant</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to Delete this Participant? All the information related to the participant's submissions will be erased.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteClient} variant="contained" color="primary">
          Yes
        </Button>
        <Button onClick={handleCloseOfModal} variant="outlined" color="primary">
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteClientModal
