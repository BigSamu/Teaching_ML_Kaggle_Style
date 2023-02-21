import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import DataVisualizationsTabs from '../DataVisualizationsTabs'

/*const useStyles = makeStyles((theme) => {
});*/

// *****************************************************************************
// A) Component Code
// *****************************************************************************

const EditCohortModal = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  const {selectedVisualization, openModal, setOpenModal, submissionPk} = props; 


  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------
  const handleCloseOfModal = () => {
    setOpenModal({...openModal, dataVisualization:false});
  }

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <Dialog maxWidth="lg" open={openModal.dataVisualization} onClose={handleCloseOfModal} aria-labelledby="form-dialog-title">
      <DialogContent>
        <DataVisualizationsTabs
            selectedVisualization={selectedVisualization} 
            submissionPk={submissionPk}
        >
        </DataVisualizationsTabs>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseOfModal} variant="outlined" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditCohortModal
