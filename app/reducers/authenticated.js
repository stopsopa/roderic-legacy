
import {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_SIGNOUT
} from '../actions';

import configPublic from '../public.config';

import { combineReducers } from 'redux';

import node from 'detect-node';

const jwtPayload = (state = {}, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:

            // {
            //     type: // aciton type
            //     payload: // jwt token (string)
            // }

            if ( ! node ) {

                try {
                    localStorage.setItem(configPublic.jwt.localStorageKey, action.payload)
                }
                catch(e) {
                    console.error('Failed to setup localStorage jwt token', e);
                }
            }

            if (typeof action.payload === 'string') {

                // https://stackoverflow.com/a/38552302/5560682
                action.payload = (function (token) {
                    try {
                        token = token.split('.')[1];
                        token = token.replace('-', '+').replace('_', '/');
                        return JSON.parse(window.atob(token));
                    }
                    catch (e) {
                        console.error('JWT payload extracting error');
                    }
                })(action.payload);

            }
            else {
                throw "Wrong type of JWT token";
            }

            return action.payload;
        case LOGIN_SIGNOUT:

            if ( ! node ) {

                try {
                    localStorage.removeItem(configPublic.jwt.localStorageKey)
                }
                catch(e) {
                    console.error('Failed to setup localStorage jwt token', e);
                }
            }

            return {};
        default:
            return state;
    }
};

const authError = (state = null, action) => {
    switch (action.type) {
        case LOGIN_FAILURE:
            return action.payload.message;
        default:
            return state;
    }
}

export default combineReducers({
    jwtPayload,
    authError
});

export const getAuthenticated = state => {

    for (let k in state.jwtPayload) {

        return true;
    }

    return false;
};

export const getUser = state => state.jwtPayload;

export const getLoginError = state => state.authError;

