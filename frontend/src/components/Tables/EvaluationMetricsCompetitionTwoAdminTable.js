import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

//MaterialUI imports
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles((theme) => ({
  table: {
    padding: "5px 10px"
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
}));


// *****************************************************************************
// B) Component Code
// *****************************************************************************

const EvaluationMetricsCompetitionTwoAdminTable = (props) => {
  
  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();

  // ii) Lifting state variables from CompetitionTwoResutlsClientDisplay or 
  // CompetitionTwoResutlsAdminDisplay component
  const {trainingAccuracy, trainingPrecision, trainingRecall, trainingF1Score} = props;
  const {validationAccuracy, validationPrecision, validationRecall, validationF1Score} = props;
  const {testingAccuracy, testingPrecision, testingRecall, testingF1Score} = props;

  // ---------------------------------------------------------------------------
  // II) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <TableContainer className={classes.table}>
        <Table>
          
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableLabelCell}><b>Evaluation Metric</b></TableCell>
              <TableCell className={classes.tableLabelCell}><b>Training</b></TableCell>
              <TableCell className={classes.tableLabelCell}><b>Validation</b></TableCell>
              <TableCell className={classes.tableLabelCell}><b>Testing</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell className={classes.tableCell}>
                Accuracy
              </TableCell>
              <TableCell className={classes.tableCell}>
                {trainingAccuracy}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {validationAccuracy}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {testingAccuracy}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableCell}>
                Precision
              </TableCell>
              <TableCell className={classes.tableCell}>
                {trainingPrecision}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {validationPrecision}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {testingPrecision}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableCell}>
                Recall
              </TableCell>
              <TableCell className={classes.tableCell}>
                {trainingRecall}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {validationRecall}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {testingRecall}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableCell}>
                F1Score
              </TableCell>
              <TableCell className={classes.tableCell}>
                {trainingF1Score}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {validationF1Score}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {testingF1Score}
              </TableCell>
            </TableRow>
            
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default EvaluationMetricsCompetitionTwoAdminTable;
