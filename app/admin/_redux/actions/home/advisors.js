
import {
    HOME_ADVISORS_REQUEST,
    HOME_ADVISORS_SUCCESS,
    HOME_ADVISORS_FAILURE,
} from '../types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../../transport';

export const homeAdvisorsRequest = () => (dispatch, getState) => {

    dispatch({
        type: HOME_ADVISORS_REQUEST
    });

    return fetchJson('/api/json/home-advisors', {
        method: 'post'
    })
        .then(json => {
            dispatch(homeAdvisorsSuccess(json));
        }, e => {
            dispatch(homeAdvisorsFailure())
        })
    ;
};

export const homeAdvisorsSuccess = data => ({
    type: HOME_ADVISORS_SUCCESS,
    payload: data
});

export const homeAdvisorsFailure = () => ({
    type: HOME_ADVISORS_FAILURE
});

