import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';

import api from '../../api';

//MaterialUI imports
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

//import components
import CompetitionFormula from '../CompetitionFormula'
import Variables from '../Variables'

//import svg
import {ReactComponent as LoadingImage} from "../../img/loading.svg"

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles((theme) => ({
  train_button: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
      '&:hover': {
          background: theme.palette.primary.dark,
      },
    color: theme.palette.common.white,
  },
  submit_button: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.success.main,
      '&:hover': {
          background: theme.palette.success.dark,
      },
    color: theme.palette.common.white,
  },
  notTrainedTextStyle: {
    color: theme.palette.error.dark
  },
  trainedTextStyle: {
    color: theme.palette.success.dark
  }
  }));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const CompetitionOneForm = (props) => {
  
  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();

  // ii) React Hooks - States

  const [modelHasBeenTrained, setModelHasBeenTrained] = useState(false);
  const [modelIsBeingTrained, setModelIsBeingTrained] = useState(false);
  const [modelHasBeenSubmitted, setModelHasBeenSubmitted] = useState(false);
  const [isTrainButtonDisabled, setIsTrainButtonDisabled] = useState(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  const featurePalette = props.featurePalette;
  const setFeaturePalette = props.setFeaturePalette;
  const formulaFeatures = props.formulaFeatures;
  const setFormulaFeatures = props.setFormulaFeatures;
  const addedFeatures = props.addedFeatures;
  const setAddedFeatures = props.setAddedFeatures;
  const removedFeatures = props.removedFeatures;
  const setRemovedFeatures = props.setRemovedFeatures;

  const isClientLoggedIn = props.isClientLoggedIn;
  const setIsClientLoggedIn = props.setIsClientLoggedIn;
  
  // iii) React Hooks - Effects

  useEffect(() => {
    props.setFormulaComponent(
      <Grid item xs={12}>
        <CompetitionFormula removeFeature ={removeFeatureFromFormula} 
                            addFeature = {addFeatureToFormula}
                            data={formulaFeatures} 
                            removedFeatures={removedFeatures}
                            addedFeatures={addedFeatures} />
      </Grid>)
  },[formulaFeatures, removedFeatures, addedFeatures]);
  
  useEffect(() =>{
    //Submit only available when formula is not empty and model has been trained
    if (modelHasBeenTrained && (!modelHasBeenSubmitted)) {
      setIsSubmitButtonDisabled(false);
      
    } else {
      setIsSubmitButtonDisabled(true);
    }
  }, [modelHasBeenTrained, modelHasBeenSubmitted]);


  useEffect(()=> {
    if ([...addedFeatures, ...formulaFeatures].length === 0) {
      setIsTrainButtonDisabled(true);
    }
  }, [addedFeatures, formulaFeatures]);

  
  
  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------
  
  const removeFeatureFromFormula = (featureToRemove) => {
    setModelHasBeenTrained(false);
    setModelHasBeenSubmitted(false);
    if (formulaFeatures.includes(featureToRemove)) {
      setFormulaFeatures(formulaFeatures.filter((feature)=>(feature !== featureToRemove)));
      setRemovedFeatures([...removedFeatures, featureToRemove]);
    } else {
      setAddedFeatures(addedFeatures.filter((feature)=>(feature !== featureToRemove)));
      setFeaturePalette([...featurePalette, featureToRemove]);
    }
    setIsTrainButtonDisabled(false);
  }

  const addFeatureToFormula = (newFeature) => {
    setModelHasBeenTrained(false);
    setModelHasBeenSubmitted(false);
    if (removedFeatures.includes(newFeature)) {
      setRemovedFeatures(removedFeatures.filter((feature)=>(feature !== newFeature)));
      setFormulaFeatures([...formulaFeatures, newFeature]);
    } else {
      setAddedFeatures([...addedFeatures, newFeature]);
      setFeaturePalette(featurePalette.filter((feature) => feature.name !== newFeature.name));
    }
    setIsTrainButtonDisabled(false);
  }

  const handleTrainButtonClicked = async () => {
    
    const selectedFeatures = [...formulaFeatures, ...addedFeatures];
    if (selectedFeatures.length == 0) {
      alert("Please construct a formula in order to train your model")
    } else {
      //make api call to train model
      props.hideResults();
      setModelHasBeenSubmitted(false);
      setModelIsBeingTrained(true);
      var train_status = await props.callbackTrainModel(selectedFeatures);
      console.log(train_status);
      if (!train_status.model_train_error && !train_status.client_login_error) {
        setModelHasBeenTrained(true);
        setModelIsBeingTrained(false);
        setIsTrainButtonDisabled(true);
        setFormulaFeatures([...formulaFeatures, ...addedFeatures]);
        setFeaturePalette([...featurePalette, ...removedFeatures]);
        setRemovedFeatures([]);
        setAddedFeatures([]);
      } else {
        setModelHasBeenTrained(false);
        setModelIsBeingTrained(false);
        setIsTrainButtonDisabled(false);
        if(train_status.client_login_error){
          setIsClientLoggedIn(false);
          localStorage.removeItem('client');
          alert("Participant not logged in!")
        }
        else{
          alert("Model failed to train. Please try again.")
        }
      }
    }
  }

  const handleSubmitButtonClicked = () => {
    props.callbackSubmitModel();
    setModelHasBeenSubmitted(true);
  }



  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (   
    <>
      { modelIsBeingTrained && <>
        <Grid container justify="center" spacing={0} style={{"marginTop":"30px"}}>
          <Grid item xs={12}>
          <h3>Training the model</h3>
            <CircularProgress/>
          </Grid>
          <Grid item xs={12}>
            <LoadingImage style={{ width: '20rem'}}/>
          </Grid>
        </Grid>
      </> }
      { !modelIsBeingTrained && <>
        {
          !modelHasBeenSubmitted && modelHasBeenTrained && <h2>Model status: <span className={classes.trainedTextStyle}>trained and ready to be submitted</span></h2>
        }
        {
          modelHasBeenSubmitted && <h2>Model status: <span className={classes.trainedTextStyle}>submitted!</span></h2>
        }
        {
          !modelHasBeenTrained && <h2>Model status: <span className={classes.notTrainedTextStyle}>not trained</span></h2>
        }
        <Button 
          className={classes.train_button}
          onClick={() => handleTrainButtonClicked()}
          disabled={isTrainButtonDisabled}
          variant="contained" 
          color="primary"
          type="submit">
            Train
        </Button>
        <Button 
          className={classes.submit_button}
          onClick={() => handleSubmitButtonClicked()}
          variant="contained" 
          color="secondary"
          type="submit"
          disabled={isSubmitButtonDisabled}>
            Submit
        </Button>
        <Grid container justify="center" spacing={0}>
          <Grid item xs={12}>
            <Variables addVariable={addFeatureToFormula} data={featurePalette}/>
          </Grid>
        </Grid>
      </>}
      {/* add clear button to clear formula? */}
      
    </>
  )
}
export default CompetitionOneForm;