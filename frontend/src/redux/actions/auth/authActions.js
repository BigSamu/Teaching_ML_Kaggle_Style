import axios from 'axios';
import * as actionTypes from './authActionTypes';
import * as config from '../../../config/config';

const SESSION_DURATION = config.SESSION_DURATION


 const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

 const authSuccess = (token) =>  {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token
    }
}

 const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        authError: error
    }
}

export const authLogin = (username, password) => {
    
    return dispatch => {
        dispatch(authStart());
        axios.post(`${config.API_SERVER}/api-auth/token/`, {
            username: username,
            password: password
        })
        .then(res => {
            console.log("Logged In");
            const token = res.data.token;
            const expirationDate = new Date(new Date().getTime() + SESSION_DURATION );
            localStorage.setItem('token', token)
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(token));
            dispatch(authCheckTimeout(SESSION_DURATION));
        })
        .catch(err => {
            dispatch(authFail(err))
        });
    }
}

export const authLogout =  () => {
   
    const token = localStorage.getItem('token');
    if (token === undefined){
        localStorage.removeItem('expirationDate');
    } else {
        axios.get(`${config.API_SERVER}/api-auth/logout/`)
            .then(console.log("Logged Out"))
            .catch(err => {console.log(err)});
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
     }

    return {
        type: actionTypes.AUTH_LOGOUT
    };
}


// ########################################################
// ########################################################
// NOT USED
// ########################################################
// ########################################################

//This sets a timer, which would automatically logout the user after a specified time
export const authCheckTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout());
        }, expirationTime)
    }
}

export const authCheckState = () => {
    console.log("checking state...")
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token == null || token === undefined) {
            console.log("No token")
            dispatch(authLogout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if ( expirationDate <= new Date() ) {
                console.log("Your expiration date finish")
                dispatch(authLogout());
            } else {
                console.log("Already Logged In")
                dispatch(authSuccess(token));
                dispatch(authCheckTimeout( expirationDate.getTime() - new Date().getTime()) );
            }
        }
    }
}