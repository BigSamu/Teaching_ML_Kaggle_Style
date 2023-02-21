
import { useHistory } from "react-router";

import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';

// *****************************************************************************
// A) Component Code
// *****************************************************************************

const CompetitionResultsButton = () => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------
    
  // i) React Routing Hooks - History
  const history = useHistory();


  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleGoToCompetitionResults = (e) => {
    history.push("/admin/"+e.currentTarget.value);
  }

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <Box mt={3} display="flex" justifyContent= "flex-end" alignItems="center">
        <Typography component="div"> 
          <Box fontWeight="fontWeightBold">Competition Results</Box>
        </Typography>
        <Box ml={2}>
          <ButtonGroup>
            <Button 
              startIcon= {<OpenInNewIcon/>}
              variant = "contained"
              color = "primary"
              name = "name"
              value = "competition_1_results"
              onClick={handleGoToCompetitionResults}
            >
              Competition 1
            </Button>
            <Button 
              startIcon= {<OpenInNewIcon/>}
              variant = "outlined"
              color = "primary"
              name = "name"
              value = "competition_2_results"
              onClick={handleGoToCompetitionResults}
            >
              Competition 2
            </Button>
          </ButtonGroup>
        </Box>
      </Box>          
    </>
  )
}

export default CompetitionResultsButton
