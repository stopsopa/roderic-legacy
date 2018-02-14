
import {
    HOME_AGILE_REQUEST,
    HOME_AGILE_SUCCESS,
    HOME_AGILE_FAILURE,
} from '../types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../../transport';

export const homeAgileRequest = () => (dispatch, getState) => {

    dispatch({
        type: HOME_AGILE_REQUEST
    });

    return fetchJson('/api/json/home-agile', {
        method: 'post'
    })
        .then(json => {
            dispatch(homeAgileSuccess(json));
        }, e => {
            dispatch(homeAgileFailure())
        })
    ;
};

export const homeAgileSuccess = data => ({
    type: HOME_AGILE_SUCCESS,
    payload: data
});

export const homeAgileFailure = () => ({
    type: HOME_AGILE_FAILURE
});

