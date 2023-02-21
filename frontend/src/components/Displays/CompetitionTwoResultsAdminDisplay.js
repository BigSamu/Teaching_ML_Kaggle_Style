import React, {useState, useEffect} from 'react';

//MaterialUI imports
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

//import components
import EvaluationMetricsCompetitionTwoAdminTable from '../Tables/EvaluationMetricsCompetitionTwoAdminTable'
import ConfusionMatrixTable from '../Tables/ConfusionMatrixTable'
import DataVisualizationModal from '../Modals/DataVisualizationModal'

//import util functions
import {getAccuracy, getPrecision, getRecall, getF1Score} from '../../utils/utils.js'

import axios from 'axios'
import * as config from '../../config/config'

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles((theme) => ({
  gridStyle: {
    margin: theme.spacing(3)
  },
}));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const CompetitionTwoResultsClientDisplay = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();

  // ii) Lifting state variables from CompetitionTwoResultsTable
  const {submissionPk,selectedVisualization} = props  

  // iii) React Hooks - States

  const [openModal, setOpenModal] = useState({
    dataVisualization: false
  });

  const [trainingData, setTrainingData] = useState({
    true_positives: "?", 
    false_positives: "?", 
    true_negatives: "?", 
    false_negatives: "?", 
    accuracy: "?",
    precision: "?", 
    recall: "?", 
    f1Score: "?", 
    isScored: false 
  });

  const [testingData, setTestingData] = useState({
    true_positives: "?", 
    false_positives: "?", 
    true_negatives: "?", 
    false_negatives: "?", 
    accuracy: "?",
    precision: "?", 
    recall: "?", 
    f1Score: "?", 
    isScored: false 
  });

  const [validationData, setValidationData] = useState({
    true_positives: "?", 
    false_positives: "?", 
    true_negatives: "?", 
    false_negatives: "?", 
    accuracy: "?",
    precision: "?", 
    recall: "?", 
    f1Score: "?", 
    isScored: false 
  });

  // iv) React Hooks - Effects and Auxiliar Fucntional Variable for API calls

  useEffect(() => {
    
    if(submissionPk !== 0){
      setScores(submissionPk, setTrainingData, 1); // 1 for Training Data
      setScores(submissionPk, setTestingData, 2); //  2 for Validation Data
      setScores(submissionPk, setValidationData, 3); //  3 for Validation Data
    }
    
  }, []);

  const setScores = async (submissionPk, setDataMetrics, score_code) => {
	  await axios.get(`${config.API_SERVER}/ml_model/score/${submissionPk}/${score_code}/`) 
    .then(res => res.data)
    .then(res => {
      let acc = getAccuracy(res.true_positives, res.false_positives, 
                            res.true_negatives, res.false_negatives);
      let prec = getPrecision(res.true_positives, res.false_positives);
      let rec = getRecall(res.true_positives, res.false_negatives);
      let f1 = getF1Score(prec, rec)
      
      setDataMetrics({
        true_positives: res.true_positives, 
        false_positives: res.false_positives, 
        true_negatives: res.true_negatives, 
        false_negatives: res.false_negatives,
        accuracy: acc.toFixed(3),
        precision: prec.toFixed(3),
        recall: rec.toFixed(3),
        f1Score: f1.toFixed(3),
        isScored: true
      })
		})
    .catch( err => {
      console.log(err)
    });
  }
  
	// ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleClickOpenDataVisualizationModal = (e) => {
    setOpenModal({...openModal, dataVisualization: true});
  };

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------
  return (
    <>
      <Box mb={4}>
        <Grid container spacing = {3} justify = "space-around" alignItems="center">
          
            <Grid item xs={6} align="center">
              <h3>Performance Evaluation Train and Validation Set:</h3>
              <EvaluationMetricsCompetitionTwoAdminTable 
                trainingAccuracy={trainingData.accuracy} 
                trainingPrecision={trainingData.precision} 
                trainingRecall={trainingData.recall} 
                trainingF1Score={trainingData.f1Score}
                validationAccuracy={validationData.accuracy} 
                validationPrecision={validationData.precision} 
                validationRecall={validationData.recall} 
                validationF1Score={validationData.f1Score}
                testingAccuracy={testingData.accuracy} 
                testingPrecision={testingData.precision} 
                testingRecall={testingData.recall} 
                testingF1Score={testingData.f1Score}
              />
              <Box m={2}>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={handleClickOpenDataVisualizationModal}
                  > Check Visualization 
                </Button>
              </Box>
            </Grid>
          </Grid>
      
          <Grid container justify = "space-around" alignItems="center">
            <Grid item xs={4} align="center">
              <h3>Confusion Matrix Training Set:</h3>
              <ConfusionMatrixTable 
                mode={"values"} 
                true_positives={trainingData.true_positives} 
                false_positives={trainingData.false_positives} 
                true_negatives={trainingData.true_negatives} 
                false_negatives={trainingData.false_negatives}
              />
            </Grid>
            <Grid item xs={4} align="center">
              <h3>Confusion Matrix Validation Set:</h3>
              <ConfusionMatrixTable 
                mode={"values"} 
                true_positives={validationData.true_positives} 
                false_positives={validationData.false_positives} 
                true_negatives={validationData.true_negatives} 
                false_negatives={validationData.false_negatives}
              />
            </Grid>
            <Grid item xs={4} align="center">
              <h3>Confusion Matrix Testing Set:</h3>
              <ConfusionMatrixTable 
                mode={"values"} 
                true_positives={testingData.true_positives} 
                false_positives={testingData.false_positives} 
                true_negatives={testingData.true_negatives} 
                false_negatives={testingData.false_negatives}
              />
            </Grid>
          </Grid>
      </Box>

      <DataVisualizationModal 
        selectedVisualization={selectedVisualization} 
        submissionPk={submissionPk}
        openModal={openModal}
        setOpenModal={setOpenModal}
      ></DataVisualizationModal>

    </>
  )
};

export default CompetitionTwoResultsClientDisplay;