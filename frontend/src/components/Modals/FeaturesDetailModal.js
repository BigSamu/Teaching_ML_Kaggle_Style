import React, {useState, useEffect} from 'react';
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

const FeaturesDetailModal = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Lifting state variables from NavBar component
  const { clientPk, clientsInCohort, open, setOpen} = props; 
  const [features, setFeatures] = useState([])

  useEffect(() =>{
    if(clientPk !==''){
      
      setFeatures(clientsInCohort.filter(item => item.pk === parseInt(clientPk))[0].features);    
    }
  },[clientPk])

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  
  const handleCloseOfModal = () => {
      setOpen({...open, featuresDetailModal:false});
  }

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open.featuresDetailModal} onClose={handleCloseOfModal} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Features Selected</DialogTitle>
      <DialogContent>
        <DialogContentText>
        {features && features.map((item, index) => (
          (index !== features.length - 1) 
          ?
            <span> {item} - </span> 
          :
            <span> {item} </span> 

        ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseOfModal} variant="outlined" color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FeaturesDetailModal