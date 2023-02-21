import axios from 'axios';
import * as actionTypes from './clientActionTypes';
import * as config from '../../../config/config';


// GET ALL CLIENTS
export const getAllClients = () =>{
    return dispatch => {
        axios.get(`${config.API_SERVER}/classroom/participant/`)
            .then(res => {
                dispatch({
                    type: actionTypes.GET_ALL_CLIENTS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    };     
};

// GET CLIENT
export const getClient = (client) =>{
    
    return dispatch => {
        axios.get(`${config.API_SERVER}/classroom/participant/${client.pk}/`)
            .then(res => {
                dispatch({
                    type: actionTypes.GET_CLIENT,
                    payload: res.data
                })
                
            })
            .catch(err => {
                console.log(err)
            })
    };     
};

// ADD CLIENT
export const addClient = (client) => {
    
    return dispatch => {
        axios.post(
                `${config.API_SERVER}/classroom/participant/`, 
                {...client})
                
            .then(res => {
                dispatch({
                    type: actionTypes.ADD_CLIENT,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    };
};

// DELETE CLIENT
export const deleteClient = (client) => {
    const token = localStorage.getItem("token");
    return dispatch => {
        axios.delete(`${config.API_SERVER}/classroom/participant/${client.pk}/`,
                {headers: {'Authorization':'JWT ' + token }})
            .then(res => {
                dispatch({
                    type: actionTypes.DELETE_CLIENT,
                    payload: client
                })
            })
            .catch(err => {
                console.log(err)
            })
    };
};


// EDIT CLIENT
export const editClient = (client) => {
    const token = localStorage.getItem("token");
    return dispatch => {
        axios.put(`${config.API_SERVER}/classroom/participant/${client.pk}/`,
                {},
                {headers: {'Authorization':'JWT ' + token }})
            .then(res => {
                dispatch({
                    type: actionTypes.EDIT_CLIENT,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    };
};

// DELETE ALL CLIENTS FROM COHORT
export const deleteAllClientsFromCohort = (cohort) => {
    const token = localStorage.getItem("token");
    return dispatch => {
        axios.post(`${config.API_SERVER}/classroom/clear_participants/${cohort.pk}/`,{},
                  { headers: {'Authorization':'JWT ' + token }})
            .then(res => {
                dispatch({
                    type: actionTypes.DELETE_ALL_CLIENTS_FROM_COHORT,
                    payload: cohort
                })
            })
            .catch(err => {
                console.log(err)
            })
    };
};

