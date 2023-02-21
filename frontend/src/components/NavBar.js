import React, {useState, useEffect} from "react";
import { useHistory, useLocation } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ExitCompetitionModal from './Modals/ExitCompetitionModal';
import LogoutModal from './Modals/LogoutModal';


// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

// i) Hook Styling
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

// *****************************************************************************
// B) Component Code
// *****************************************************************************

const NavBar = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  // i) Passed variables for from App Component
  const {isAdminAuthenticated, isClientLoggedIn, setIsClientLoggedIn} = props;

  // ii) React Hooks - State
  const [userType, setUserType] = useState('user');
  const [pathLocation, setPathLocation] = useState('');

  const [open, setOpen] = useState({
    exitCompetitionModal: false,
    logoutModal:false
  });

  // iii) Material UI Hooks
  const classes = useStyles();

  // v) React Routing Hooks - History and Location
  let history = useHistory();
  let location = useLocation();
  
  // vi) React Hooks - Effects
  useEffect(() => {
    handleLocationChange(location)
    
    return () => {
      handleLocationChange(location)
      
    }
 },[location])

  // ---------------------------------------------------------------------------
  // II) Handlers
  // ---------------------------------------------------------------------------

  const handleAdminLogout = () => {
    setOpen({...open, logoutModal: true});
  }

  const handleClientLogout = () => {
    localStorage.removeItem('client');
    setIsClientLoggedIn(false)
  }

  const handleLocationChange = (location) => {
    if(location.pathname.includes("admin"))
      setUserType("admin");
    setPathLocation(location.pathname);
    
  }

  const handleAdminGoBack = () => {
    history.push('/admin/');
  }

  const handleExitCompetition = () => {
    setOpen({...open, exitCompetitionModal: true});
  }
 
  // ---------------------------------------------------------------------------
  // III) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
          Imperial College - ML101
          </Typography>
          { (isAdminAuthenticated === true && 
            userType === 'admin' && 
            (pathLocation === '/admin/competition_1_results' || 
              pathLocation === '/admin/competition_2_results')) ? 
            <Button color="inherit" onClick={handleAdminGoBack}>Go Back</Button> :
            ''
          }
          { (
            userType === 'user' && 
            (pathLocation === '/competition_1' || 
              pathLocation === '/competition_2')) ? 
            <Button color="inherit" onClick={handleExitCompetition}>Exit Competiton</Button> :
            ''
          }
          { (
            pathLocation === '/' &&
            isClientLoggedIn) ? 
            <Button color="inherit" onClick={handleClientLogout}>Logout</Button> :
            ''
          }
          {
            (isAdminAuthenticated === true && userType === 'admin') ? 
            <Button color="inherit" onClick={handleAdminLogout}>Logout</Button> : 
            ''
          }
        </Toolbar>
      </AppBar>
      
      <ExitCompetitionModal
          open = {open} 
          setOpen = {setOpen}
      />
      <LogoutModal
          open = {open} 
          setOpen = {setOpen}
      />
    </>
  )
}

export default NavBar;