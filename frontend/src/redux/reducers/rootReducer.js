import authReducer from './auth/authReducer';
import clientReducer from './client/clientReducer';
import cohortReducer from './cohort/cohortReducer';

import { combineReducers } from 'redux';

const reducers = combineReducers({
  auth: authReducer,
  client: clientReducer,
  cohort: cohortReducer,
  
});

export default reducers;