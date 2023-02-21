import React, {useState, useEffect} from 'react';
import api from '../../api';


//MaterialUI imports 
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

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
  formControl: {
    marginTop: theme.spacing(2), 
    minWidth: "14rem"
  },
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

const CompetitionTwoForm = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();

  // ii) Special Variables ??? => CHECK
  const modelArchitectures = ["Logistic Regression", "Decision Tree"]

  // iii) React Hooks - States

  const [modelHasBeenTrained, setModelHasBeenTrained] = useState(false);
  const [modelIsBeingTrained, setModelIsBeingTrained] = useState(false);
  const [modelHasBeenSubmitted, setModelHasBeenSubmitted] = useState(false);
  const [selectedModelArchitecture, setSelectedModelArchitecture] = useState("Logistic Regression");
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

  const modelArchitectureCodes = {
    "Logistic Regression": 1,
    "Decision Tree": 2
  }
  

  // iii) React Hooks - Effects
  useEffect(()=> {
    props.setFormulaComponent(
      <Grid item xs={12}>
        <CompetitionFormula removeFeature={removeFeatureFromFormula} 
                            addFeature = {addFeatureToFormula}
                            data={formulaFeatures}
                            removedFeatures={removedFeatures}
                            addedFeatures={addedFeatures}/>
      </Grid>);
  }, [formulaFeatures, addedFeatures, removedFeatures]);

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
      setIsTrainButtonDisabled(false);
      if (removedFeatures.includes(newFeature)) {
        setRemovedFeatures(removedFeatures.filter((feature)=>(feature !== newFeature)));
        setFormulaFeatures([...formulaFeatures, newFeature]);
      } else {
        setAddedFeatures([...addedFeatures, newFeature]);
        setFeaturePalette(featurePalette.filter((feature) => feature.name !== newFeature.name));
      }
      setIsTrainButtonDisabled(false);
  }

  const handleModelArchitectureSelection = (selectedArchitecture) => {
    if (selectedModelArchitecture !== selectedArchitecture) {
      setSelectedModelArchitecture(selectedArchitecture);
      setModelHasBeenTrained(false);
      setModelHasBeenSubmitted(false);
      setIsTrainButtonDisabled(false);
    }
  } 

  const handleTrainButtonClicked = async () => {
    const selectedFeatures = [...formulaFeatures, ...addedFeatures];
    if (selectedFeatures.length === 0) {
      alert("Please construct a formula in order to train your model")
    } else {
      //make api call to train model
      props.hideResults();
      setModelIsBeingTrained(true);

      var train_status = await props.callbackTrainModel(selectedFeatures, modelArchitectureCodes[selectedModelArchitecture]);
      console.log(train_status);
      if (train_status.model_train_error || train_status.client_login_error) {
        setModelHasBeenTrained(false);
        setModelIsBeingTrained(false);
        props.callbackCompetitionTwoForm(true);
        setIsTrainButtonDisabled(false);
        if(train_status.client_login_error){
          setIsClientLoggedIn(false);
          localStorage.removeItem('client');
          alert("Participant not logged in!")
        }
        else{
          alert("Model failed to train. Please try again.")
        }
      } else {
        setModelHasBeenTrained(true);
        setModelIsBeingTrained(false);
        props.callbackCompetitionTwoForm(true);
        setIsTrainButtonDisabled(true);
        setFormulaFeatures([...formulaFeatures, ...addedFeatures]);
        setFeaturePalette([...featurePalette, ...removedFeatures]);
        setRemovedFeatures([]);
        setAddedFeatures([]);
      }
    }
  }

  const handleSubmitButtonClicked = () => {
    props.callbackSubmitModel();
    setModelHasBeenSubmitted(true);
    setIsSubmitButtonDisabled(true);
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
      {
          !modelIsBeingTrained && <> 
          {
            !modelHasBeenSubmitted && modelHasBeenTrained && <h2>Model status: <span className={classes.trainedTextStyle}>trained and ready to be submitted</span></h2>
          }
          {
            modelHasBeenSubmitted && <h2>Model status: <span className={classes.trainedTextStyle}>submitted!</span></h2>
          }
          {
            !modelHasBeenTrained && <h2>Model status: <span className={classes.notTrainedTextStyle}>not trained</span></h2>
          }

        <Grid container justify="center" spacing={0}>
          <Grid item xs={6}>
            <FormControl className={classes.formControl}>
              <InputLabel>Select a model architecture</InputLabel>
              <Select required value={selectedModelArchitecture}>
                {
                  modelArchitectures && modelArchitectures.map((modelArchitecture) => (
          
                    <MenuItem key={modelArchitecture} value = {modelArchitecture} onClick={() => handleModelArchitectureSelection(modelArchitecture)}>
                        {modelArchitecture}
                    </MenuItem>
                      
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Button 
              className={classes.train_button}
              onClick={() => handleTrainButtonClicked()}
              variant="contained" 
              color="primary"
              type="submit"
              disabled={isTrainButtonDisabled}>
                  Train
            </Button>
            <Button 
              className={classes.submit_button}
              onClick={()=>handleSubmitButtonClicked()}
              variant="contained" 
              color="primary"
              type="submit"
              disabled={isSubmitButtonDisabled}>
                  Submit
            </Button>
            </Grid>
          </Grid>
          <Variables addVariable={addFeatureToFormula} data={featurePalette}/>
        </>
      }
      
    </>
  )
}
export default CompetitionTwoForm;