import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Add from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#43a047',
    }
  },
});


const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    margin: 0,
    height: '30vh', // Matt - from 15vh
    overflow: 'scroll',
    overflowY: 'visible',
    overflowX: "hidden",
    boxShadow: "none",
    backgroundColor: theme.palette.grey[200],
    border: "0px solid black"
  },
  variable: {
    margin: theme.spacing(0.5),
    fontSize: 14,
    
  },
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 16,
  },
  superdiv: {
    padding: theme.spacing(1),
    overflowY: "auto",
    border: '1px solid',
    borderColor: theme.palette.grey[500],
  },
}));

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[5],
    padding: "1rem",
    border: "1px black",
    fontSize: 14,
    fontWeight: 400
  },
}))(Tooltip);

const Variables = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();

  // ii) Passed variables for from ??? Component => REVIEW
  const variables = props.data;

  // iii) ????
  let icon = <Add />


  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const addVariableToFormula = (newVariable) => {
      props.addVariable(newVariable)
  }

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <div className={classes.root}>
      {
        (variables.length === 0) && <h3>No features available</h3>
      }
      {
        (variables.length > 0) && <h3>Add new features from the list below:</h3>
      }
      <ThemeProvider theme={theme}>
      <div className={classes.superdiv}>
      <Paper square={true} component="ul" className={classes.paper}>
      {variables.map((variable,index) => {
        return (
        <li key={index}>
        <LightTooltip title={variable.comment}>
          <Chip
          label={variable.name}
          icon={icon}
          
          variant="outlined"
          className={classes.variable}
          onClick={() => addVariableToFormula(variable)}
          />
        </LightTooltip>
        </li>
        );
      })}
      </Paper>
      </div>
      </ThemeProvider>
    </div>
  );
}

export default Variables;