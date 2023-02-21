import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import BlockIcon from '@material-ui/icons/Block';
import VisibilityIcon from '@material-ui/icons/Visibility';

import EditCohortModal from '../Modals/EditCohortModal';
import DeleteCohortModal from '../Modals/DeleteCohortModal';
import RemoveAllClientsFromCohortModal from '../Modals/RemoveAllClientsFromCohortModal';

import _ from "lodash";

import {getAllCohorts, editCohort} from '../../redux/actions/cohort/cohortAction'

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
    fontWeight: 600,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
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
      margin: 'auto',
      justifyContent:'space-around',
      textTransform: 'capitalize',
      color: theme.palette.primary.main,
      fontWeight: 600,  
    }
  },
  typography:{
    fontSize: 14,
    fontWeight: 600,
  }

}));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const AdminMainTable = (props) =>{
  
  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Material UI Hooks
  const classes = useStyles();

  // ii) Lifting State Variables from AdminHome page component
  const {deleteAllCohortsFlag, setDeleteAllCohortsFlag} = props;

  // iii) React Hooks - States
  
  const [openModal, setOpenModal] = useState({
    deleteCohortModal: false,
    editCohortModal: false,
    removeAllClientsFromCohortModal: false
  });

  const [cohortPk, setCohortPk] = useState('');

  // iv) Redux Hooks - Selectors and Dispatchers
  const {cohorts} = useSelector(state =>  state.cohort);
  const dispatch = useDispatch();

  // v) React Hooks - Effects

  useEffect(() => {
    dispatch(getAllCohorts());
  },[])

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleClickOpenDeleteCohortModal = (e) => {
    let pk = e.currentTarget.value;
    setCohortPk(pk);
    setOpenModal({...openModal, deleteCohortModal: true});
  };

  const handleClickOpenEditCohortModal = (e) => {
    let pk = e.currentTarget.value;
    setCohortPk(pk);
    setOpenModal({...openModal, editCohortModal: true});
  };

  const handleClickOpenRemoveAllClientsFromCohortModal = (e) => {
    let pk = e.currentTarget.value;
    setCohortPk(pk);
    setOpenModal({...openModal, removeAllClientsFromCohortModal: true});
  }

  const handleCompetitionEnable = (e) => {
    let pk = e.currentTarget.value;
    let id = cohorts.findIndex(cohort => cohort.pk === parseInt(pk));
    let selectedCohort = cohorts[id];
    
    if(e.currentTarget.name === 'competition_1_access')
        selectedCohort.competition_1_access = !selectedCohort.competition_1_access
    else
        selectedCohort.competition_2_access = !selectedCohort.competition_2_access

    dispatch(editCohort(selectedCohort));
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
              <StyledTableCell align="center">COHORT</StyledTableCell>
              <StyledTableCell align="center">COMPETION ENABLE</StyledTableCell>
              <StyledTableCell align="center">ACTIONS</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cohorts && cohorts.map((item, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align="center" component="th" scope="cohorts">
                  {item.name}
                </StyledTableCell>
                <StyledTableCell align="center" >
                    <FormGroup row className={classes.link}>
                      <FormControlLabel 
                        
                        control={
                          <Switch
                            color="primary"
                            checked={item.competition_1_access}
                            value={item.pk}
                            name = 'competition_1_access'
                            onChange={handleCompetitionEnable}
                          />
                        }
                        label= {
                          <Typography className={classes.typography} component="div"> 
                            <Box fontWeight="fontWeightBold">
                              { item.competition_1_access ? 
                                <span>Disable Competition #1</span> :
                                <span>Enable Competition #1</span>
                              }
                            </Box>
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            color="primary"
                            checked={item.competition_2_access}
                            onChange={handleCompetitionEnable}
                            name = 'competition_2_access'
                            value={item.pk} 
                          />
                        }
                        label= {
                          <Typography className={classes.typography} component="div"> 
                            <Box fontWeight="fontWeightBold">
                              { item.competition_2_access ? 
                                <span>Disable Competition #2</span> :
                                <span>Enable Competition #2</span>
                              }
                            </Box>
                          </Typography>
                        }
                      />
                    </FormGroup>
                </StyledTableCell>
                <StyledTableCell align="center"> 
                <Box display='flex' className={classes.link}>
                  <Button 
                    startIcon={<DeleteIcon/>}
                    value={item.pk}
                    onClick={handleClickOpenDeleteCohortModal}
                  >
                    Delete
                  </Button>
                  <Button 
                    startIcon={<EditIcon/>}
                    value={item.pk} 
                    onClick={handleClickOpenEditCohortModal}
                  >
                    Edit
                  </Button>
                  <Button 
                    startIcon={<DeleteIcon/>}
                    value={item.pk}
                    onClick={handleClickOpenRemoveAllClientsFromCohortModal}
                  >
                    Remove All Participants
                  </Button>
                </Box>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <DeleteCohortModal
        cohortPk = {cohortPk}
        openModal = {openModal} 
        setOpenModal = {setOpenModal}
      />       
      <EditCohortModal
        cohortPk = {cohortPk}
        openModal = {openModal} 
        setOpenModal = {setOpenModal}
      />
      <RemoveAllClientsFromCohortModal
        cohortPk = {cohortPk}
        openModal = {openModal} 
        setOpenModal = {setOpenModal}
      />

    </>
  );
}

export default AdminMainTable 






