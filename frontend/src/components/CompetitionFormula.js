import React from 'react';
import { makeStyles, rgbToHex } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/icons/TagFaces';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';
import Clear from '@material-ui/icons/Clear';
import Divider from '@material-ui/core/Divider';

import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';

// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling

let addIcon = <Add />
let deleteIcon = <Clear />


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#43a047',
    }
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    margin: 0,
    overflow: 'scroll',
    overflowY: 'visible',
    overflowX: "hidden",
    height: '30vh',
    boxShadow: "none",
    backgroundColor: theme.palette.grey[200],
  },
  variable: {
    margin: theme.spacing(0.5),
    fontSize: 14
  },
  subpaper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(3),
    marginBottom:theme.spacing(1),
    margin: 0,
    overflow: 'scroll',
    overflowY: 'visible',
    overflowX: "hidden",
    boxShadow: "none",
    backgroundColor: theme.palette.grey[200],
    border: '0px solid black',
    minHeight: '11vh',
  },
  superdiv: {
    height: '37vh',
    padding: theme.spacing(1,1,0,1),
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


// *****************************************************************************
// B) Component Code
// *****************************************************************************

function CompetitionFormula(props) {
  
  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Lifting State Variables => NORMALIZE CALLS WITH OTHER PART OF CODE
  const variables = [...props.data, ...props.addedFeatures];

  // ii) Material UI Hooks
  const classes = useStyles();

  const getColor = (variable) => {
    if (props.data.includes(variable)) {
      return "default";
    } else if (props.addedFeatures.includes(variable)) {
      return "primary";
    } else if (props.removedFeatures.includes(variable)) {
      return "secondary";
    }
  }

  const stateChange = (feature) => () => {
    if (props.removedFeatures.includes(feature)) {
      props.addFeature(feature);
    } else {
      props.removeFeature(feature);
    }
  }

  const deleteIfApplicable = (feature) => () => {
    if (!props.removedFeatures.includes(feature)) {
      props.removeFeature(feature);
    }
  }

  const addIfApplicable = (feature) => () => {
    if (props.removedFeatures.includes(feature)) {
      props.addFeature(feature);
    }
  }


  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <div>
        <h2>Model formula: </h2>
        <div className={classes.superdiv}>
        
        <ThemeProvider theme={theme}>
        {
          (true) && <>
          <Paper square={true} className={classes.subpaper}>
          <p><b>From Previous Model:</b></p>
        { props.data.map((variable, index) => {
            return (
            <li key={index}>
                <LightTooltip title={variable.comment}>
                <Chip
                label={variable.name}
                icon = {(props.removedFeatures.includes(variable)) ? addIcon : deleteIcon}
                clickable={props.removedFeatures.includes(variable)}
                onClick = {stateChange(variable)}
                className={classes.variable}
                color={getColor(variable)}
                />
                </LightTooltip>
            </li>
            );
        })}</Paper></>
        }
        {
          (true) && <>
          <Paper square={true} className={classes.subpaper}>
          <p><b>To Add:</b></p>
        { props.addedFeatures.map((variable, index) => {
            return (
            <li key={index}>
                <LightTooltip title={variable.comment}>
                <Chip
                label={variable.name}
                icon = {(props.removedFeatures.includes(variable)) ? addIcon : deleteIcon}
                clickable={props.removedFeatures.includes(variable)}
                onClick = {stateChange(variable)}
                className={classes.variable}
                color={getColor(variable)}
                />
                </LightTooltip>
            </li>
            );
        })}</Paper></>}
        {
          (true) && <>
          <Paper square={true} className={classes.subpaper}>
          <p><b>To Remove:</b></p>
        { props.removedFeatures.map((variable, index) => {
            return (
            <li key={index}>
                <LightTooltip title={variable.comment}>
                <Chip
                label={variable.name}
                icon = {(props.removedFeatures.includes(variable)) ? addIcon : deleteIcon}
                clickable={props.removedFeatures.includes(variable)}
                onClick = {stateChange(variable)}
                className={classes.variable}
                color={getColor(variable)}
                />
                </LightTooltip>
            </li>
            );
        })}</Paper></>}
        </ThemeProvider>
    
        </div>
        </div>
    </>
    
  );
}

export default CompetitionFormula;