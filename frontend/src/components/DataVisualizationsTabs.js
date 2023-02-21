import React, {useEffect, useState} from 'react';

//MaterialUI imports
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Bar } from 'react-chartjs-2';
import { deprecatedPropType } from '@material-ui/core';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import DecTree from './DecTree';

import axios from 'axios';
import * as config from '../config/config';
import _ from "lodash";


// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles({
  root: {
    float: 'right'
  },
  logRegTable: {
      border: "3px solid black",
      "& caption": {
        font: "20px bold"
      },
      "& table": {
        //border: "1px solid black"
      },
      "& tr": {
        border: "1px solid black"
      }
  }
});

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const DataVisualizationTabs = (props) => {
  // i) Material UI Hooks
  const classes = useStyles();

  // ii) React Hooks - States
  const [value, setValue] = useState(0);
  const [decTreeData, setDecTreeData] = useState("");
  const [logRegData, setLogRegData] = useState("");
  const [dataVizIsLoading, setDataVizIsLoading] = useState(true);


  // ?????
  const barChartOptions = {
        legend: { display: false },
        title: {
          display: true,
          text: 'The coefficients of your LogReg model'
        },
        maintainAspectRatio: true
  };

  useEffect( async ()=>{
    console.log(props.selectedVisualization)
    await axios.get(`${config.API_SERVER}/ml_model/get_visualization/${props.submissionPk}/`)
    .then(res=>{
      if (props.selectedVisualization === 1) {
        console.log(res.data)
        setLogRegData(res.data);
      } else if (props.selectedVisualization === 2) {
        setDecTreeData(res.data);
      }
    });
    setDataVizIsLoading(false);
  }, []);

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <Grid container justify="center">
      {
        (dataVizIsLoading === true) && <Grid container align="center" justify="center">
        <Grid item xs={12}>
          <p>Loading...</p>
        </Grid>
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
        </Grid>
      }
      {
        (dataVizIsLoading === false) && <Grid item xs = {12}>
        {
        props.selectedVisualization === 1 && <>
          <div className={classes.logRegTable} dangerouslySetInnerHTML={{__html: logRegData}}></div>
        </>
        }
        {
        props.selectedVisualization === 2 && 
        <TransformWrapper>
          <TransformComponent>
          <DecTree
          data={decTreeData}
          orientation={1}
          />
          </TransformComponent>
        </TransformWrapper>
        }
      </Grid>

      }
    </Grid>
  );
}

export default DataVisualizationTabs;