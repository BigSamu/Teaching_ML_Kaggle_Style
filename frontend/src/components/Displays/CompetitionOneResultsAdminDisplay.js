import React, {useState, useEffect} from 'react';

//MaterialUI imports
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

//import components
import EvaluationMetricsCompetitionOneAdminTable from '../Tables/EvaluationMetricsCompetitionOneAdminTable'
import ConfusionMatrixTable from '../Tables/ConfusionMatrixTable'

//import util functions
import {getAccuracy, getPrecision, getRecall, getF1Score} from '../../utils/utils.js'

import axios from 'axios'
import * as config from '../../config/config'

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles((theme) => ({
	confusionMatrixGrid: {
			marginTop: theme.spacing(2) 
	}
}));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const CompetitionOneResultsClientDisplay = (props) => {
	
	// ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------
	
  // i) Material UI Hooks
	const classes = useStyles();
  
  
  // ii) Lifting state variables from CompetitionOnePage or CompetitionOneResultsTable
  const {submissionPk,displayResults} = props  
  
  // iii) React Hooks - States

  const [trainingData, setTrainingData] = useState({
    true_positives: "?", 
    false_positives: "?", 
    true_negatives: "?", 
    false_negatives: "?", 
    accuracy: "?", 
  });

  const [testingData, setTestingData] = useState({
    true_positives: "?", 
    false_positives: "?", 
    true_negatives: "?", 
    false_negatives: "?", 
    accuracy: "?", 
  });

 	// iv) React Hooks - Effects and Auxiliar Fucntional Variable for API calls

  useEffect(() => {
    
    if(submissionPk !== 0){
      setScores(submissionPk, setTrainingData, 1); // 1 for Training Data
      setScores(submissionPk, setTestingData, 2); //  2 for Testing Data
    }
    
  }, []);

  const setScores = async (submissionPk, setDataMetrics, score_code) => {
	  await axios.get(`${config.API_SERVER}/ml_model/score/${submissionPk}/${score_code}/`) 
    .then(res => res.data)
    .then(res => {
      let acc = getAccuracy(res.true_positives, res.false_positives, 
                            res.true_negatives, res.false_negatives);

      setDataMetrics({
        true_positives: res.true_positives, 
        false_positives: res.false_positives, 
        true_negatives: res.true_negatives, 
        false_negatives: res.false_negatives,
        accuracy: acc.toFixed(3),

      })
		})
    .catch( err => {
      console.log(err)
    });
  }

	// ---------------------------------------------------------------------------
  // II) JSX
  // ---------------------------------------------------------------------------

	return (
		<>
			<Grid container spacing = {3} justify = "space-around" alignItems="center">
				
        <Grid item xs={4} align="center">
          <h3>Performance Evaluation: </h3>
          <EvaluationMetricsCompetitionOneAdminTable
            trainingAccuracy={trainingData.accuracy}
            testingAccuracy={testingData.accuracy}
          />
				</Grid>

				<Grid item xs={4} align="center">
          <h3>Confusion Matrix Training Set: </h3>
          <ConfusionMatrixTable 
            mode={"values"} 
            true_positives={trainingData.true_positives} 
            false_positives={trainingData.false_positives} 
            true_negatives={trainingData.true_negatives} 
            false_negatives={trainingData.false_negatives}/>
				</Grid>
        

				<Grid item xs={4} align="center">
          <h3>Confusion Matrix Testing Set: </h3>
          <ConfusionMatrixTable 
            mode={"values"} 
            true_positives={testingData.true_positives} 
            false_positives={testingData.false_positives} 
            true_negatives={testingData.true_negatives} 
            false_negatives={testingData.false_negatives}/>
				</Grid>
        
			</Grid>
		</>
	)
};

export default CompetitionOneResultsClientDisplay;