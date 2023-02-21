import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

//MaterialUI imports
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';

import RemoveClientModal from '../Modals/RemoveClientModal';
import FeaturesDetailModal from '../Modals/FeaturesDetailModal';
import CompetitionOneResultsAdminDisplay from '../Displays/CompetitionOneResultsAdminDisplay.js'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DeleteIcon from '@material-ui/icons/Delete';

import axios from 'axios';
import * as config from '../../config/config';

import _ from "lodash";
import {clientsDetailsResultsForCompetitionOne} from '../../utils/utils'


//import components


// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) HOC Styling
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey[700],
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  body: {
    fontSize: 14,
    fontWeight: 600
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(4n+1)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

// ii) Hook Styling
const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: '',
    alignItems: 'center',
    },
  table: {
    margin: theme.spacing(3,0,2),
  },
  link: {
    textDecoration: 'underline',
    '& > * ': {
      marginLeft: theme.spacing(2),
      textTransform: 'capitalize',
      color: theme.palette.primary.main,
      fontWeight: 600,  
    }
  },
  typography:{
    fontSize: 14,
    fontWeight: 600,
  },
  iconButton:{
    color: 'white',
  }

}));


// *****************************************************************************
// B) Main Component Code
// *****************************************************************************

const CompetitionOneResultsTable = (props) =>{
  
  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();

  // ii) Lifting state variables from CompetitionOneResutlsPage component
  const {isRefreshingList, setIsRefreshingList, currentCohort, setCurrentCohort} = props;


  // iii) React Hooks - States

  const [clientsInCohort, setClientsInCohort] = useState([])
  const [openModal, setOpenModal] = useState({
    deleteClientModal: false,
    featuresDetailModal: false
  });

  
  const [clientPk, setClientPk] = useState('');
  const [isAscendingOrder, setIsAscendingOrder] = useState({
    name: false,
    training:false,
    testing:false,
    number_of_features:false
  });

  // iv) React Hooks - Effects

  useEffect(() => {
    
    if(!_.isEmpty(currentCohort)){
      setIsRefreshingList(false);
      axios.get(`${config.API_SERVER}/classroom/participant_detail/`)
        .then(res => res.data)
        .then(res => {
          const selectedClients = res.filter(item => (item.cohort === currentCohort.pk))
                                     .filter(item => (!_.isEmpty(item.final_submission_1)))
          setClientsInCohort(clientsDetailsResultsForCompetitionOne(selectedClients));
        })
    }

  },[currentCohort,isRefreshingList])

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleOrderParticipantsByResults = (e) => {
    let orderBy = e.currentTarget.name;
    let clientsOrdered = clientsInCohort;
    
    if(orderBy === "name") {
      if(!isAscendingOrder.name)
        clientsOrdered = _.orderBy(clientsInCohort,['first_name'],['desc'])
      else  
        clientsOrdered = _.orderBy(clientsInCohort,['first_name'],['asc'])
      setIsAscendingOrder({...isAscendingOrder,name:!isAscendingOrder.name});
    }
    else if(orderBy === "training_accuracy") {
      if(!isAscendingOrder.training)
        clientsOrdered = _.orderBy(clientsInCohort,['training_accuracy'],['desc'])
      else  
        clientsOrdered = _.orderBy(clientsInCohort,['training_accuracy'],['asc'])
      setIsAscendingOrder({...isAscendingOrder,training:!isAscendingOrder.training});
    }
    else if(orderBy === "testing_accuracy") {
      if(!isAscendingOrder.testing)
        clientsOrdered = _.orderBy(clientsInCohort,['testing_accuracy'],['desc'])
      else  
        clientsOrdered = _.orderBy(clientsInCohort,['testing_accuracy'],['asc'])
      console.log(isAscendingOrder)
      setIsAscendingOrder({...isAscendingOrder,testing:!isAscendingOrder.testing});
    }
    else {
      if(!isAscendingOrder.number_of_features)
        clientsOrdered = _.orderBy(clientsInCohort,['number_of_features'],['desc'])
      else  
        clientsOrdered = _.orderBy(clientsInCohort,['number_of_features'],['asc'])
      setIsAscendingOrder({...isAscendingOrder,number_of_features:!isAscendingOrder.number_of_features});
    }
  
    setClientsInCohort(clientsOrdered);
    
  };


  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------
  
  return (
    <>
      <TableContainer className={classes.paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell> </StyledTableCell>
              <StyledTableCell>
                STUDENT NAME
                <IconButton 
                  size="small" 
                  className={classes.iconButton}
                  name="name"
                  onClick={handleOrderParticipantsByResults}
                >
                  {(!isAscendingOrder.name) 
                    ? <KeyboardArrowUpIcon/> 
                    : <KeyboardArrowDownIcon/> 
                  }
                </IconButton>
              </StyledTableCell>
              <StyledTableCell align="center">
                TRAINING
                <IconButton 
                  size="small" 
                  className={classes.iconButton}
                  name="training_accuracy"
                  onClick={handleOrderParticipantsByResults}
                >
                  {(!isAscendingOrder.training) 
                    ? <KeyboardArrowUpIcon/> 
                    : <KeyboardArrowDownIcon/> 
                  }
                </IconButton>
              </StyledTableCell>
              <StyledTableCell align="center">
                TESTING
                <IconButton 
                  size="small" 
                  className={classes.iconButton}
                  name="testing_accuracy"
                  onClick={handleOrderParticipantsByResults}
                >
                  {(!isAscendingOrder.testing) 
                    ? <KeyboardArrowUpIcon/> 
                    : <KeyboardArrowDownIcon/> 
                  }
                </IconButton>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                NUMBER OF FEATURES
                <IconButton 
                  size="small" 
                  className={classes.iconButton}
                  name="number_of_features"
                  onClick={handleOrderParticipantsByResults}
                >
                  {(!isAscendingOrder.number_of_features) 
                    ? <KeyboardArrowUpIcon/> 
                    : <KeyboardArrowDownIcon/> 
                  }
                </IconButton>
              </StyledTableCell>
              <StyledTableCell align="center">ACTIONS</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
            {clientsInCohort && clientsInCohort.map((item, index) => (  
              
              <ClientResultRow 
                key={index}
                selectedClient={item}
                openModal = {openModal}
                setOpenModal ={setOpenModal}
                setClientPk = {setClientPk}
              />
                
            ))}
    
          </TableBody>
        </Table>
      </TableContainer>
      
      <RemoveClientModal
        clientPk = {clientPk}
        clientsInCohort = {clientsInCohort}
        setClientsInCohort = {setClientsInCohort}
        open = {openModal} 
        setOpen = {setOpenModal}
      />  

      <FeaturesDetailModal
        clientPk = {clientPk}
        clientsInCohort = {clientsInCohort}
        open = {openModal} 
        setOpen = {setOpenModal}
      />
        

    </>
  );
}

export default CompetitionOneResultsTable 

// *****************************************************************************
// C) Other Component Code
// *****************************************************************************


const ClientResultRow = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------


  // i) Material UI Hooks
  const classes = useStyles();

  // ii) Passed variables for from Main Component (CompetitionResultsTable)
  const {selectedClient, setOpenModal, openModal, setClientPk} = props;


  // iii) React Hooks - States
  const [openRow, setOpenRow] = useState(false);
 
  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleOpenRow = () => {
    setOpenRow(!openRow)
  }

  const handleClickOpenDeleteClientModal = (e) => {
    let pk = e.currentTarget.value;
    console.log(pk)
    setClientPk(pk);
    setOpenModal({...openModal, deleteClientModal: true});
  };

  const handleClickOpenFeaturesDetailModal = (e) => {
    let pk = e.currentTarget.value;
    setClientPk(pk);
    setOpenModal({...openModal, featuresDetailModal: true});
  };


  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <StyledTableRow >
        <StyledTableCell component="th" scope="cohorts">
          <IconButton aria-label="expand row" size="small" onClick={handleOpenRow}>
            {openRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="cohorts">
          <span>{selectedClient.first_name} {selectedClient.last_name} </span>
        </StyledTableCell>
        <StyledTableCell align="center">  
          <span>{selectedClient.training_accuracy} </span>
        </StyledTableCell>
        <StyledTableCell align="center">  
          <span>{selectedClient.testing_accuracy} </span>
        </StyledTableCell>
        <StyledTableCell align="center" className={classes.link}>  
          <Button 
            value={selectedClient.pk}
            onClick={handleClickOpenFeaturesDetailModal}
          >
            {selectedClient.number_of_features}
          </Button>
        </StyledTableCell>
        <StyledTableCell align="center" className={classes.link}>
          <Button 
            startIcon={<DeleteIcon/>}
            value={selectedClient.pk}
            onClick={handleClickOpenDeleteClientModal}
          >  
          </Button>
        </StyledTableCell>
      </StyledTableRow>
      
      <TableRow >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
        <Collapse in={openRow} timeout="auto" unmountOnExit>
          <Box margin={1}>
            <CompetitionOneResultsAdminDisplay 
              submissionPk={selectedClient.submission_pk} 
            /> 
          </Box>
        </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}


