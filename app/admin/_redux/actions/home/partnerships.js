
import {
    HOME_PARTNERSHIPS_REQUEST,
    HOME_PARTNERSHIPS_SUCCESS,
    HOME_PARTNERSHIPS_FAILURE,
} from '../types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../../transport';

export const homePartnershipsRequest = () => (dispatch, getState) => {

    dispatch({
        type: HOME_PARTNERSHIPS_REQUEST
    });

    return fetchJson('/api/json/home-partnerships', {
        method: 'post'
    })
        .then(json => {
            dispatch(homePartnershipsSuccess(json));
        }, e => {
            dispatch(homePartnershipsFailure())
        })
    ;
};

export const homePartnershipsSuccess = data => ({
    type: HOME_PARTNERSHIPS_SUCCESS,
    payload: data
});

export const homePartnershipsFailure = () => ({
    type: HOME_PARTNERSHIPS_FAILURE
});

