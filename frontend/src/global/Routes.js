import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from 'history';

import CssBaseline  from '@material-ui/core/CssBaseline';

import AdminLandingPage from "../pages/AdminLandingPage";
import AdminHomePage from "../pages/AdminHomePage";
import ClientLandingPage from "../pages/ClientLandingPage";
import CompetitionOnePage from "../pages/CompetitionOnePage";
import CompetitionTwoPage from "../pages/CompetitionTwoPage";
import CompetitionOneResultsPage from '../pages/CompetitionOneResultsPage'
import CompetitionTwoResultsPage from '../pages/CompetitionTwoResultsPage'

import NavBar from "../components/NavBar"
import Footer from "../components/Footer"

// *****************************************************************************
// Component Code
// *****************************************************************************


const Routes = (props) => {
  
  // i) Passed variables for from App Component
  const {isClientLoggedIn, setIsClientLoggedIn, isAdminAuthenticated} = props;

  // ii) React Routing Hooks - History
  const history = createBrowserHistory();

  return (
    <div>
      <CssBaseline/>
      <BrowserRouter history={history}>
        <NavBar
          isClientLoggedIn = {isClientLoggedIn}
          setIsClientLoggedIn = {setIsClientLoggedIn}
          isAdminAuthenticated={isAdminAuthenticated}
        />
        <Switch>

            {/* Client Routes */}
            <Route exact path="/"> 
              <ClientLandingPage 
                isClientLoggedIn = {isClientLoggedIn} 
                setIsClientLoggedIn = {setIsClientLoggedIn}
              />
            </Route>
            <Route exact path="/competition_1"> 
              {(isClientLoggedIn) 
                ? 
                <CompetitionOnePage 
                  isClientLoggedIn = {isClientLoggedIn} 
                  setIsClientLoggedIn = {setIsClientLoggedIn}
                /> 
                : 
                <Redirect to="/"/>}
            </Route>
            <Route exact path="/competition_2">
              {(isClientLoggedIn) ? 
                <CompetitionTwoPage 
                  isClientLoggedIn = {isClientLoggedIn} 
                  setIsClientLoggedIn = {setIsClientLoggedIn}
                /> 
                : 
                <Redirect to="/"/>}}
            </Route>
            
            {/* Admin Routes */}
            <Route exact path="/admin"> 
              {(isAdminAuthenticated) ? <AdminHomePage/> : <AdminLandingPage/>}
            </Route>
            <Route exact path="/admin/competition_1_results"> 
              {(isAdminAuthenticated) ? <CompetitionOneResultsPage/> : <Redirect to="/admin"/>} 
            </Route>
            <Route exact path="/admin/competition_2_results"> 
              {(isAdminAuthenticated) ? <CompetitionTwoResultsPage/> : <Redirect to="/admin"/>} 
            </Route>

            {/* No recognize route starting with "/" */}
            <Route path="/"> 
              <Redirect to="/"/>
            </Route>     

        </Switch>
        <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default Routes;