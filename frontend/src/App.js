import React, {useState, useEffect} from "react";
import Routes from "./global/Routes"
import {useDispatch, useSelector} from 'react-redux';
import {authCheckState}from './redux/actions/auth/authActions';
import './App.css';

import { createMuiTheme, ThemeProvider  } from '@material-ui/core/styles';

import _ from "lodash";


// *****************************************************************************
// A) Component Stylying (Material UI)
// *****************************************************************************

const App = (props) => {

  // ---------------------------------------------------------------------------
  // I) Hooks and Variables
  // ---------------------------------------------------------------------------

  const font =  "'Lato', sans-serif";
  const theme = createMuiTheme({
    typography: {
     //fontFamily: font,
      button: {
        textTransform: "none"
      }
    }
  });

  // React Hooks - State
  const [isClientLoggedIn, setIsClientLoggedIn] = useState((!_.isEmpty(localStorage.getItem('client'))) ? true : false);

  // i) Redux Hooks - Dispatchers and Selectors
  const dispatch = useDispatch();
  const {token} = useSelector(state =>  state.auth);

  // ii) Variable used to pass information about authentication to othr components
  const isAdminAuthenticated = (!_.isEmpty(token)) ? true : false;

  // iii) React Hooks - Effects
  useEffect(() => {
    dispatch(authCheckState())
  }, []);

  // ---------------------------------------------------------------------------
  /// II) JSX
  // ---------------------------------------------------------------------------

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <Routes 
        isClientLoggedIn = {isClientLoggedIn}
        setIsClientLoggedIn = {setIsClientLoggedIn}
        isAdminAuthenticated={isAdminAuthenticated}
      />
    </div>
    </ThemeProvider>
  );
}

export default App
