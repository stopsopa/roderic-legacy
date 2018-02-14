
import {
    HOME_INDEPENDENT_REQUEST,
    HOME_INDEPENDENT_SUCCESS,
    HOME_INDEPENDENT_FAILURE,
} from '../types';

import {
    fetchJson, fetchData
} from '../../../transport';

export const homeIndependentRequest = () => (dispatch, getState) => {

    dispatch({
        type: HOME_INDEPENDENT_REQUEST
    });

    return fetchJson('/api/json/home-independent', {
        method: 'post'
    })
        .then(json => {
            dispatch(homeIndependentSuccess(json));
        }, e => {
            dispatch(homeIndependentFailure())
        })
    ;
};

export const homeIndependentSuccess = data => ({
    type: HOME_INDEPENDENT_SUCCESS,
    payload: data
});

export const homeIndependentFailure = () => ({
    type: HOME_INDEPENDENT_FAILURE
});

