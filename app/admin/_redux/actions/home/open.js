
import {
    HOME_OPEN_REQUEST,
    HOME_OPEN_SUCCESS,
    HOME_OPEN_FAILURE,
} from '../types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../../transport';

export const homeOpenRequest = () => (dispatch, getState) => {

    dispatch({
        type: HOME_OPEN_REQUEST
    });

    return fetchJson('/api/json/home-open', {
        method: 'post'
    })
        .then(json => {
            dispatch(homeOpenSuccess(json));
        }, e => {
            dispatch(homeOpenFailure())
        })
    ;
};

export const homeOpenSuccess = data => ({
    type: HOME_OPEN_SUCCESS,
    payload: data
});

export const homeOpenFailure = () => ({
    type: HOME_OPEN_FAILURE
});

