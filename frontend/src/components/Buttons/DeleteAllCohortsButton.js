import React, {useState} from 'react';
import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import DeleteIcon from '@material-ui/icons/Delete';

import DeleteAllCohortsModal from '../Modals/DeleteAllCohortsModal';

// *****************************************************************************
// A) Component Code
// *****************************************************************************

const DeleteAllCohortsButton = () => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------


  // i) React Hooks - State
  const [openModal, setOpenModal] = useState({
    deleteAllCohortsModal: false,
  });
 
  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleClickOpenDeleteAllCohortModal = (e) => {
    setOpenModal({...openModal, deleteAllCohortsModal: true});
  }

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <Box display="flex" justifyContent = "flex-end">
        <Button 
          startIcon={<DeleteIcon />}
          variant= "outlined"
          color = "primary"
          onClick={handleClickOpenDeleteAllCohortModal}
        >
          Delete All Cohorts
        </Button>
      </Box>    

      <DeleteAllCohortsModal
        openModal = {openModal} 
        setOpenModal = {setOpenModal}
      />    
    </>
  )
}

export default DeleteAllCohortsButton
