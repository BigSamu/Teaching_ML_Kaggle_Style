import React, {useState, useEffect} from 'react';
import api from '../../api';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import _ from "lodash";

// *****************************************************************************
// A) Component Code
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles((theme) => ({
  table: {
    padding: "0px 10px"
  },
  tableCell: {
    border: "1px solid black",
    align: "center",
    textAlign: "center",
    padding: "5px 10px"
  },
  tableLabelCell: {
    border: "1px solid black",
    align: "center",
    textAlign: "center",
    padding: "5px 10px",
    backgroundColor: "#3f51b5",
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  edgeTopLeftCell: {
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    align: "center",
    textAlign: "center"
  },
  edgeTopRightCell: {
    borderBottom: "1px solid black",
    borderLeft: "1px solid black",
  },
  edgeBottomLeftCell: {
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "0px" 
  },
  edgeBottomRightCell: {
    borderTop: "1px solid black",
    borderLeft: "1px solid black",
    borderBottom: "0px" 
  },
}));

const ConfusionMatrixTable = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();

  // ii) React Hooks - States
  const true_positives = props.true_positives;
  const true_negatives = props.true_negatives;
  const false_positives = props.false_positives;
  const false_negatives = props.false_negatives;

  const total_ct = true_positives + true_negatives + false_positives + false_negatives;
  const tp_rate = true_positives/total_ct;
  const tn_rate = true_negatives/total_ct;
  const fp_rate = false_positives/total_ct;
  const fn_rate = false_negatives/total_ct;

  const use_proportions = (props.mode === "proportion");
  const tp_disp = use_proportions ? tp_rate : true_positives;
  const tn_disp = use_proportions ? tn_rate : true_negatives;
  const fp_disp = use_proportions ? fp_rate : false_positives;
  const fn_disp = use_proportions ? fn_rate : false_negatives;

  const total_p = tp_disp + fp_disp;
  const total_n = tn_disp + fn_disp;
  const total_tp_fn = tp_disp + fn_disp;
  const total_fp_tn = fp_disp + tn_disp;

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------


  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      
      <TableContainer className={classes.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.edgeTopLeftCell}>n = {(_.isNumber(total_ct)) ? total_ct : '?'}</TableCell>
              <TableCell className={classes.tableLabelCell}><b>Predicted:<br/>High Crime</b></TableCell>
              <TableCell className={classes.tableLabelCell}><b>Predicted:<br/>Low Crime</b></TableCell>
              <TableCell className={classes.edgeTopRightCell}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className={classes.tableLabelCell} component="th" scope="row">
                <b>Actual:<br/>High Crime</b>
              </TableCell>
              <TableCell className={classes.tableCell}>TP = {tp_disp}</TableCell>
              <TableCell className={classes.tableCell}>FN = {fn_disp}</TableCell>
              <TableCell className={classes.tableCell}>{(_.isNumber(total_tp_fn))? total_tp_fn : '?'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableLabelCell} component="th" scope="row">
                <b>Actual:<br/>Low Crime</b>
              </TableCell>
              <TableCell className={classes.tableCell}>FP = {fp_disp}</TableCell>
              <TableCell className={classes.tableCell}>TN = {tn_disp}</TableCell>
              <TableCell className={classes.tableCell}>{(_.isNumber(total_fp_tn)) ? total_fp_tn : '?'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.edgeBottomLeftCell} component="th" scope="row"></TableCell>
              <TableCell className={classes.tableCell}>{(_.isNumber(total_p)) ? total_p : '?'} </TableCell>
              <TableCell className={classes.tableCell}>{(_.isNumber(total_n)) ? total_n : '?'} </TableCell>
              <TableCell className={classes.edgeBottomRightCell}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default ConfusionMatrixTable;
