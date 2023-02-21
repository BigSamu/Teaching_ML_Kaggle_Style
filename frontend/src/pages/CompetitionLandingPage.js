import React from 'react'

//imports from MaterialUI
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/core/styles";


import CompetitionSlider from './CompetitionSlider';


//import svg
import {ReactComponent as CompetitionLandingPageSVG} from "../../src/img/runnerStartSVG.svg"


const useStyles = makeStyles((theme) => ({
    accordion: {
        boxShadow: "None",
        paddingTop: '0px',
    },
    heading: {
      fontSize: theme.typography.pxToRem(20),
      fontWeight: theme.typography.fontWeightMedium,
    },
    accordionDetails: {
        margin: 'auto!important'
    },
  }));

  const AccordionSummary = withStyles({
    content: {
      flexGrow: 0
    }
  })(MuiAccordionSummary);


export const CompetitionLandingPage = (props) => {
    const classes = useStyles();
    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={6} align="center">
                        <CompetitionLandingPageSVG style={{"maxWidth": "25rem", "maxHeight": "400"}}/>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Box p={1} align="center">
                            <h1 style={{"fontSize":"3rem"}}>Welcome to competition {props.competition}!</h1>
                            <h2>Train your model and aim to get a high accuracy! Are you ready?</h2>
                        </Box>
                        
                        <Box  align="center">
                            <Button
                            variant = "contained"
                            color = "primary"
                            name = "name"
                            onClick={props.callbackShowCompetition}
                            style={{"width":"12rem", "fontSize":"1rem", "marginTop": "2rem"}}
                            >Get started</Button>
                        </Box>

                    </Grid>

                </Grid>
           
        
                <Box width = {1000} mx={'auto'}>         
                    <Accordion className={classes.accordion}>
                        <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                            <p>
                                <span style={{ background: "none", border: "none" }}><u>How will the competition work?</u></span>
                            </p>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetails}>
                            <CompetitionSlider/>
                        </AccordionDetails>
                    </Accordion>
                </Box>
           
                                        
            </Container>
        
        </>
    )
}

export default CompetitionLandingPage;
