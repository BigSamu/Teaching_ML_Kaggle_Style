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

const EvaluationMetricsCompetitionOneAdminTable = (props) => {
  
  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();
  

  // ii) Lifting state variables from CompetitionOneResutlsClientDisplay or 
  // CompetitionOneResutlsAdminDisplay component
  const {trainingAccuracy, testingAccuracy} = props;
  

  // ---------------------------------------------------------------------------
  // II) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <TableContainer className={classes.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableLabelCell}>
                Evaluation Metric
              </TableCell>
              <TableCell className={classes.tableLabelCell}>
                Training
              </TableCell>
              <TableCell className={classes.tableLabelCell}>
                Testing
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className={classes.tableCell} >
                Accuracy
              </TableCell>
              <TableCell className={classes.tableCell}>
                {trainingAccuracy}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {testingAccuracy}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
export default EvaluationMetricsCompetitionOneAdminTable;

