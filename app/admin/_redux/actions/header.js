
import {
    HEADER_REQUEST,
    HEADER_SUCCESS,
    HEADER_FAILURE,
} from './types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../transport';

import delay, { then } from "../../../react/webpack/delay";

export const headerRequest = () => (dispatch, getState) => {

    dispatch({
        type: HEADER_REQUEST
    });

    return  fetchJson('/api/json/header', {
        method: 'post'
    })
        .then(json => {
            dispatch(headerSuccess(json));
        }, e => {
            dispatch(headerFailure())
        })
    ;
};

export const headerSuccess = data => ({
    type: HEADER_SUCCESS,
    payload: data
});

export const headerFailure = () => ({
    type: HEADER_FAILURE
});

