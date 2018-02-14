
import {
    HOME_CURRENT_REQUEST,
    HOME_CURRENT_SUCCESS,
    HOME_CURRENT_FAILURE,
} from '../types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../../transport';

export const homeCurrentRequest = () => (dispatch, getState) => {

    dispatch({
        type: HOME_CURRENT_REQUEST
    });

    return fetchJson('/api/json/home-current', {
        method: 'post'
    })
        .then(json => {
            dispatch(homeCurrentSuccess(json));
        }, e => {
            dispatch(homeCurrentFailure())
        })
    ;
};

export const homeCurrentSuccess = data => ({
    type: HOME_CURRENT_SUCCESS,
    payload: data
});

export const homeCurrentFailure = () => ({
    type: HOME_CURRENT_FAILURE
});

