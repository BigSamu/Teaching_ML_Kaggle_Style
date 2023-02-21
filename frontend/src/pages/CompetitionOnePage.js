import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router";

import api from '../api';
//MaterialUI imports

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';


import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";


//import components
import CompetitionOneForm from '../components/Forms/CompetitionOneForm'
import CompetitionOneResultsClientDisplay from '../components/Displays/CompetitionOneResultsClientDisplay'
import ModelSubmittedPage from '../components/ModelSubmittedPage.js'
import CompetitionLandingPage from './CompetitionLandingPage.js'

import {getAllClients} from '../redux/actions/client/clientAction'

import axios from 'axios'
import * as config from '../config/config'
import _ from "lodash";

import {getArrayOfFeatureNames} from "../utils/utils"


// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles((theme) => ({    
    mainContent: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2, 5, 2),
    },
    accordion: {
      boxShadow: "None",
      marginTop: theme.spacing(0),
    },
    heroContent: {
      //backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(8, 0, 6),
    },
    header:{
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
      fontWeight: 600,
    },
    headerDescription:{
      marginBottom: theme.spacing(2),
      textAlign: "justify",
    }
  }));

  const AccordionSummary = withStyles({
    content: {
      flexGrow: 0
    }
  })(MuiAccordionSummary);

 

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const CompetitionOnePage = (props) => {
   
  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------  

    // i) Material UI Hooks
    const classes = useStyles();

    // ii) Lifting state variables from App component, through Routes and ClientLandingPage component
    const {isClientLoggedIn, setIsClientLoggedIn} = props;

    // ii) React Hooks - States
    const [displayResults, setDisplayResults] = useState(false);
    const [currentClient, setCurrentClient] = useState({});
    const [submissionPk, setSubmissionPk] = useState(-1);
    const [displayCompetitionForm, setDisplayCompetitionForm] = useState(true);
    const [modelSubmitted, setModelSubmitted] = useState(false);
    const [showCompetition, setShowCompetition] = useState(false);  
    const [formulaFeatures, setFormulaFeatures] = useState([]); 
    const [removedFeatures, setRemovedFeatures] = useState([]);
    const [addedFeatures, setAddedFeatures] = useState([]);
    const [featurePalette, setFeaturePalette] = useState([]);
    const [formulaComponent, setFormulaComponent] = useState(<></>);

    // iii) Redux Hooks - Selectors and Dispatchers
    const {clients} = useSelector(state =>  state.client);
    const dispatch = useDispatch();
    
    // iv)  React Hooks - Effects
    useEffect(() => {
      
      dispatch(getAllClients());
      api.ml_model.get_features()
      .then((features) => {
          setFeaturePalette(features);
      })
    } ,[])

    useEffect(() => {
      if(!_.isEmpty(clients)){
        let currentClientUsername = JSON.parse(localStorage.getItem('client')).username
        let id = clients.findIndex(client => client.username === currentClientUsername);
        let selectedClient = clients[id];
        setCurrentClient({...selectedClient});
      }
    },[clients])

    useEffect(() => {
      if(!_.isEmpty(currentClient)){
        axios.post(`${config.API_SERVER}/ml_model/create_submission/` + currentClient.pk + `/` + `1` + `/`)
          .then(res => res.data)
          .then(res => {
            
            setSubmissionPk(res.pk)
          })
      }
     
    },[currentClient])


    useEffect(() => {
      if(modelSubmitted){
        setModelSubmitted(false)
        axios.post(`${config.API_SERVER}/ml_model/create_submission/` + currentClient.pk + `/` + `1` + `/`)
          .then(res => res.data)
          .then(res => {
            console.log(res);
            setSubmissionPk(res.pk);
        })
      } 
    },[modelSubmitted])

    //--------------------------------------------------------------------------
    // II) Handlers
    //--------------------------------------------------------------------------


    const callbackTrainModel = async (modelFeatures) => {
      
      
      const arrayOfFeatureNames = getArrayOfFeatureNames(modelFeatures);
      const obj = {"features": arrayOfFeatureNames};
      var train_status = {
        client_login_error: false,
        model_train_error: false
      };
      
      await axios.get(`${config.API_SERVER}/classroom/participant/${currentClient.pk}/`)
      .then(res => {
          axios.post(`${config.API_SERVER}/ml_model/set_train_submission/${submissionPk}/1/`, obj)
            .then(res => {
                  setDisplayResults(true);
                  
                }) 
            .catch(err=> {
              train_status.model_train_error = true;
              setDisplayResults(false);
            });
          }) 
      .catch(err=> {
        train_status.client_login_error = true;
      });

      return train_status;
    }

    const hideResults = () => {
      console.log("Hiding Results - Competition 1");
      setDisplayResults(false);
    }

    const callbackSubmitModel = async () => {
      await axios.post(`${config.API_SERVER}/ml_model/make_submission_final/${submissionPk}/`)
        .then(res => {
          console.log("model has been submitted");
        });
      setDisplayCompetitionForm(false);
      setModelSubmitted(true);
    }

    const callbackShowCompetitionForm = () => {
        setDisplayCompetitionForm(true);
       
    }

    const callbackShowCompetition = () => {
      setShowCompetition(true);
    }

    //--------------------------------------------------------------------------
    // III) Handlers
    //--------------------------------------------------------------------------


    return ( 
      <>
        
        <div className={classes.mainContent}>
        <Container maxWidth="xl">
          <Grid container spacing={4} justify="center">
            {
              (showCompetition === false) && 
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '75vh'}}
              >
              <Grid item xs={12}>
                <CompetitionLandingPage callbackShowCompetition={callbackShowCompetition} competition={"1"}/>
              </Grid>   

            </Grid> 
            }
            {
              (showCompetition === true) && <>
              <Grid item xs={6} align="center">
              <Typography 
                className={classes.header}
                variant="h5"
                align="center" 
                color="textPrimary" 
                gutterBottom = {true}
              >
                Competition One
              </Typography>
                  
              <Typography
                className={classes.headerDescription}
                variant="body1"
                color="textPrimary" 
                gutterBottom = {true}
              >
                
                Can you predict which cities have a higher-than-average crime rate? Select relevant <i>features</i> below.
                
              </Typography>

              <Typography
                className={classes.headerDescription}
                variant="body1"
                color="textPrimary" 
                gutterBottom = {true}
              >
                
                Start training your model until you can feel you get a correct result. Select features to train a model based on these features. You can always add or remove features and re-train. Submit only when you feel you have your best model ready.
              
              </Typography>

              <Divider />
              <Divider />
              <Divider />
              {
                displayCompetitionForm && <CompetitionOneForm 
                currentClient = {currentClient}
                callbackTrainModel={callbackTrainModel}
                callbackSubmitModel={callbackSubmitModel}
                hideResults={hideResults}
                formulaFeatures={formulaFeatures}
                setFormulaFeatures={setFormulaFeatures}
                removedFeatures={removedFeatures}
                setRemovedFeatures={setRemovedFeatures}
                addedFeatures={addedFeatures}
                setAddedFeatures={setAddedFeatures}
                featurePalette={featurePalette}
                setFeaturePalette={setFeaturePalette}
                setFormulaComponent={setFormulaComponent}
                isClientLoggedIn = {isClientLoggedIn}
                setIsClientLoggedIn = {setIsClientLoggedIn}
                /> 
              } 

              {
                displayCompetitionForm && 
                <Accordion className={classes.accordion}>
                  <AccordionSummary
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  >
                      <p>
                          <span style={{ background: "none", border: "none" }}><u>What is happening?</u></span>
                      </p>
                  </AccordionSummary>
                  <AccordionDetails className={classes.headerDescription}>
                    <small>
                      <p>
                        Above, you can see your model's performance with a <i>Confusion Matrix</i>. This shows the following data points:
                      </p>
                    <ul>                
                      <li><b>True Positives(TF)</b>: Number of high-crime cities that your model correctly identified</li>
                      <li><b>True Negatives(TN)</b>: Number of low-crime cities that your model correctly identified</li>
                      <li><b>False Positives(FP)</b>: Number of low-crime cities that your model falsely identified as high crime</li>
                      <li><b>False Negatives(FN)</b>: Number of high-crime cities that your model falsly identified as low crime</li>
                    </ul>
                    <p>
                      You will can also see your model's accuracy. This is the proportion of all cities that your model identified correctly ((TP + TN)/(TP + TN + FP + FN)).
                    </p>
                    </small>
                  </AccordionDetails>
                </Accordion> 
              }

              {
                !displayCompetitionForm && <ModelSubmittedPage callbackShowCompetitionForm={callbackShowCompetitionForm}/>
              }

            </Grid>
            
            <Grid item xs={6} align="center">

             
              {formulaComponent}
              <Box >    
                <CompetitionOneResultsClientDisplay
                  displayResults = {displayResults}
                  submissionPk={submissionPk}
                />
              </Box>           
            </Grid>
              </>
            }
            
          </Grid>
        </Container>
        </div>    
      </> 
    )
}
export default CompetitionOnePage;