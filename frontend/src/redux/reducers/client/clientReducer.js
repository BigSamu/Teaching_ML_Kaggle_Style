
import * as actionTypes from '../../actions/client/clientActionTypes';

import {getPrivateKey} from '../../../utils/utils'


// ########################################################
// Initial State
// ########################################################

 const initialState = {
    clients: [],
    savedClient:{}
}


// ########################################################
// Different Reducer Functions which change the store state
// ########################################################
const getAllClientsReducer = (state, action) => {
    return  {
        ...state,
        clients: action.payload,
    };
}

const getClientReducer = (state, action) => {
    return {
        clients: state.clients.filter((client) => client.pk === action.payload.pk)
    };
}

const addClientReducer = (state, action) => {
    return {
        ...state,
        clients: [...state.clients, action.payload],
    };
}

const deleteClientReducer = (state, action) => {
    return {
        ...state,
        clients: state.clients.filter((client) => client.pk !== action.payload.pk),
    };
}

const editClientReducer = (state, action) => {
    const id = state.clients.findIndex(cohort => cohort.pk === action.payload.pk);
    const editedClients = [...state.cohorts];
    editedClients[id] = action.payload
    return {
        ...state,
        [action.payload.pk]: editedClients
      };
}

const deleteAllCliensFromCohortReducer = (state, action) => {
    
    return {
        ...state,
        clients: state.clients.filter((client) => getPrivateKey(client.cohort) !== action.payload.pk),
    };
}

// ########################################################
// The Main Reducer 
// ########################################################

const clientReducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_CLIENTS: return getAllClientsReducer(state, action);
        case actionTypes.GET_CLIENT: return getClientReducer(state, action);
        case actionTypes.ADD_CLIENT: return addClientReducer(state, action);
        case actionTypes.DELETE_CLIENT: return deleteClientReducer(state, action);
        case actionTypes.EDIT_CLIENT: return editClientReducer(state, action);
        case actionTypes.DELETE_ALL_CLIENTS_FROM_COHORT: return deleteAllCliensFromCohortReducer(state, action);

        default:
            return state;
    }
}

export default clientReducer