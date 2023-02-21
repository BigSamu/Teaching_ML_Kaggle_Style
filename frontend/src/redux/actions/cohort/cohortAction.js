import axios from 'axios';
import * as actionTypes from './cohortActionTypes';
import * as config from '../../../config/config';


// GET ALL COHORTS
export const getAllCohorts = () =>{
  
    return dispatch => {
        axios.get(
                `${config.API_SERVER}/classroom/cohort/`)
            .then(res => {
                dispatch({
                    type: actionTypes.GET_ALL_COHORTS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    };     
};

// GET COHORT
export const getCohort = (cohort) =>{
    return dispatch => {
        axios.get(
                `${config.API_SERVER}/classroom/cohort/${cohort.pk}/`)
            .then(res => {
                dispatch({
                    type: actionTypes.GET_COHORT,
                    payload: res.data
                })
            })
    };     
};

// ADD COHORT
export const addCohort = (cohort) => {
    const token = localStorage.getItem("token")
    return dispatch => {
        axios.post(
                `${config.API_SERVER}/classroom/cohort/`, 
                { ...cohort},
                { headers: {'Authorization':'JWT ' + token}})
            .then(res => {
                dispatch({
                    type: actionTypes.ADD_COHORT,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    };
};

// DELETE COHORT
export const deleteCohort = (cohort) => {
    const token = localStorage.getItem("token")
    return dispatch => {
        axios.delete(
                `${config.API_SERVER}/classroom/cohort/${cohort.pk}/`,
                {headers:{'Authorization':'JWT ' + token}})   
            .then(res => {
                dispatch({
                    type: actionTypes.DELETE_COHORT,
                    payload: cohort
                })
            })
            .catch(err => {
                console.log(err)
            })
    };
};


// EDIT COHORT
export const editCohort = (cohort) => {
    const token = localStorage.getItem("token");
    return dispatch => {
        axios.put(
                `${config.API_SERVER}/classroom/cohort/${cohort.pk}/`,  
                {...cohort},
                { headers: {'Authorization':'JWT ' + token }})
            .then(res => {
                dispatch({
                    type: actionTypes.EDIT_COHORT,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })      
    };
};

// DELETE ALL COHORTS
export const deleteAllCohorts = () => {
    const token = localStorage.getItem("token")
    return dispatch => {
        axios.post(
                `${config.API_SERVER}/classroom/delete_cohorts/`,
                {}, 
                {headers:{'Authorization':'JWT ' + token}})   
            .then(res => {
                dispatch({
                    type: actionTypes.DELETE_ALL_COHORTS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    };
};

// SAVE COHORT
export const saveCohort = (cohort) => {
    return dispatch => {
        dispatch({
            type: actionTypes.SAVE_COHORT,
            payload: cohort
        })    
    };
};

// ENABLE ALL COHORTS
export const enableAllCohorts = () => {
    const token = localStorage.getItem("token");
    return dispatch => {
        axios.post(
                `${config.API_SERVER}/classroom/enable_cohorts/`,
                {}, 
                {headers: {'Authorization':'JWT ' + token }})
            .then(res => {
               
                dispatch({
                    type: actionTypes.ENABLE_ALL_COHORTS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })      
    };
};

// ENABLE ALL COHORTS
export const disableAllCohorts = () => {
    const token = localStorage.getItem("token");
    console.log("Token: " + token);
    return dispatch => {
        axios.post(
                `${config.API_SERVER}/classroom/disable_cohorts/`, 
                {},
                {headers: {'Authorization':'JWT ' + token }})
            .then(res => {
                
                dispatch({
                    type: actionTypes.DISABLE_ALL_COHORTS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })      
    };
};

// ENABLE ACCESS COMPETITION ONE ALL COHORTS
export const enableAccessCompetitionInAllCohorts = (competition) => {
    const token = localStorage.getItem("token");
    const competitionNumber = (competition === "competition_1") ? '1' : '2';
    return dispatch => {
        axios.post(
                `${config.API_SERVER}/classroom/enable_comp_cohorts/${competitionNumber}/`,  
                {},
                { headers: {'Authorization':'JWT ' + token }}, {})
            .then(res => {
                dispatch({
                    type: actionTypes.ENABLE_ACCESS_COMPETITION_IN_ALL_COHORTS,
                    payload: competition
                })
            })
            .catch(err => {
                console.log(err)
            })      
    };
};


// ENABLE ACCESS COMPETITION TWO ALL COHORTS
export const disableAccessCompetitionInAllCohorts = (competition) => {
    const token = localStorage.getItem("token");
    const competitionNumber = (competition === "competition_1") ? '1' : '2';
    return dispatch => {
        axios.post(
                `${config.API_SERVER}/classroom/disable_comp_cohorts/${competitionNumber}/`,  
                {},
                { headers: {'Authorization':'JWT ' + token }})
            .then(res => {
                dispatch({
                    type: actionTypes.DISABLE_ACCESS_COMPETITION_IN_ALL_COHORTS,
                    payload: competition
                })
            })
            .catch(err => {
                console.log(err)
            })      
    };
};