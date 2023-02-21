
import * as actionTypes from '../../actions/cohort/cohortActionTypes';

// ########################################################
// Initial State
// ########################################################

 const initialState = {
    cohorts: [],
    savedCohort: {
        competition_1: {},
        competition_2: {}
    }
}


// ########################################################
// Different Reducer Functions which change the store state
// ########################################################
const getAllCohortsReducer = (state, action) => {
    return  {
        ...state,
        cohorts: action.payload,
    };
}

const getCohortReducer = (state, action) => {
    return {
        cohorts: state.cohorts.filter((cohort) => cohort.pk === action.payload.pk)
    };
}

const addCohortReducer = (state, action) => {
    
    return {
        ...state,
        cohorts: [...state.cohorts, action.payload],
    };
}

const deleteCohortReducer = (state, action) => {
    return {
        ...state,
        cohorts: state.cohorts.filter((cohort) => cohort.pk !== action.payload.pk),
    };
}

const editCohortReducer = (state, action) => {
    const id = state.cohorts.findIndex(cohort => cohort.pk === action.payload.pk);
    const editedCohorts = [...state.cohorts];
    editedCohorts[id] = action.payload
    return {
        ...state,
        cohorts: editedCohorts
      };
}

const deleteAllCohortsReducer = (state, action) => {
    return {
        ...state,
        cohorts: state.cohorts.filter((cohort) => cohort.pk === 'a'),
    };
}

const saveCohortReducer = (state, action) => {
    let cohortCompetitionOne = (action.payload.competition_1_access) ? action.payload : {}
    let cohortCompetitionTwo = (action.payload.competition_2_access) ? action.payload : {}
    return {
        ...state,
        savedCohort: {competition_1: cohortCompetitionOne,competition_2: cohortCompetitionTwo}
    };
}

const enableAllCohortsReducer = (state, action) => {
    const editedCohorts = [...state.cohorts];
    editedCohorts.forEach((cohort) => {
        cohort.is_active = true
    })
    return {
        ...state,
        cohorts: editedCohorts
    };
}

const disableAllCohortsReducer = (state, action) => {
    const editedCohorts = [...state.cohorts];
    editedCohorts.forEach((cohort) => {
        cohort.is_active = false
    })
    
    return {
        ...state,
        cohorts: editedCohorts
    };
}

const enableAccessCompetitionInAllCohorts = (state, action) => {
    const editedCohorts = [...state.cohorts];
     
    if(action.payload === 'competition_1'){
        editedCohorts.forEach((cohort) => {
            cohort.competition_1_access = true
        })
    }
    else{
        editedCohorts.forEach((cohort) => {
            cohort.competition_2_access = true
        })
    }
    return {
        ...state,
        cohorts: editedCohorts
    };
}

const disableAccessCompetitionInAllCohorts = (state, action) => {
    const editedCohorts = [...state.cohorts];

    if(action.payload === 'competition_1'){
        editedCohorts.forEach((cohort) => {
            cohort.competition_1_access = false
        })
    }
    else{
        editedCohorts.forEach((cohort) => {
            cohort.competition_2_access = false
        })
    }
    return {
        ...state,
        cohorts: editedCohorts
    };
}

// ########################################################
// The Main Reducer 
// ########################################################

const cohortReducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_COHORTS: return getAllCohortsReducer(state, action);
        case actionTypes.GET_COHORT: return getCohortReducer(state, action);
        case actionTypes.ADD_COHORT: return addCohortReducer(state, action);
        case actionTypes.DELETE_COHORT: return deleteCohortReducer(state, action);
        case actionTypes.EDIT_COHORT: return editCohortReducer(state, action);
        case actionTypes.DELETE_ALL_COHORTS: return deleteAllCohortsReducer(state, action);
        case actionTypes.SAVE_COHORT: return saveCohortReducer(state, action);
        case actionTypes.ENABLE_ALL_COHORTS: return enableAllCohortsReducer(state, action);
        case actionTypes.DISABLE_ALL_COHORTS: return disableAllCohortsReducer(state, action);
        case actionTypes.ENABLE_ACCESS_COMPETITION_IN_ALL_COHORTS: return enableAccessCompetitionInAllCohorts(state, action);
        case actionTypes.DISABLE_ACCESS_COMPETITION_IN_ALL_COHORTS: return disableAccessCompetitionInAllCohorts(state, action);

        default:
            return state;
    }
}

export default cohortReducer