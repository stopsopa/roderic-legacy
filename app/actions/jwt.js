
// https://auth0.com/blog/secure-your-react-and-redux-app-with-jwt-authentication/
// https://github.com/auth0-blog/nodejs-jwt-authentication-sample
// https://github.com/auth0-blog/redux-auth

import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_SIGNOUT
} from './types';

import {
    loaderOn,
    loaderOff
} from './index';

import {
    getLoaderStatus,
    getLoading,
    getFormData
} from '../reducers';

export const loginRequest = (username, password) => (dispatch, getState) => {

    const state = getState();

    if (getLoading(state)) {

        return Promise.resolve('canceled');
    }

    dispatch(loaderOn());

    return new Promise(resolve => {
        setTimeout(() => {

            dispatch(loaderOff());
            resolve('done');
        }, 1000);
    });
}

export const loginSuccess = __JWT_TOKEN__ => ({
    type: LOGIN_SUCCESS,
    payload: __JWT_TOKEN__
});

export const loginError = message => ({
    type: LOGIN_FAILURE,
    payload: {
        message
    }
});

export const loginSignOut = () => ({
    type: LOGIN_SIGNOUT
});
