import React, {useState, useEffect} from 'react';

//MaterialUI imports
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

//import components
import EvaluationMetricsCompetitionOneClientTable from '../Tables/EvaluationMetricsCompetitionOneClientTable'
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

 	// iv) React Hooks - Effects and Auxiliar Fucntional Variable for API calls

  useEffect(() => {
    
    if(submissionPk !== 0 && displayResults === true){
      setScores(submissionPk, setTrainingData, 1); // 1 for Training Data
    }
    
  }, [displayResults]);

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
			<Grid container direction = "column" spacing = {1} justify = "space-around" alignItems="center">
				
        <Grid item xs={12} align="center">
					<Box ml={7}>
						<h3>Performance Evaluation: </h3>
						<EvaluationMetricsCompetitionOneClientTable
							trainingAccuracy={trainingData.accuracy}
						/>
					</Box>
				</Grid>

				<Grid item xs={12} align="center">
					<Box>
						<h3>Confusion Matrix Training Set: </h3>
						<ConfusionMatrixTable 
							mode={"values"} 
							true_positives={trainingData.true_positives} 
							false_positives={trainingData.false_positives} 
							true_negatives={trainingData.true_negatives} 
							false_negatives={trainingData.false_negatives}/>
					</Box>
				</Grid>
        
			</Grid>
		</>
	)
};

export default CompetitionOneResultsClientDisplay;