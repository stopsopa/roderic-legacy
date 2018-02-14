
import {
    HOME_PARTNERS_REQUEST,
    HOME_PARTNERS_SUCCESS,
    HOME_PARTNERS_FAILURE,
} from '../types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../../transport';

export const homePartnersRequest = () => (dispatch, getState) => {

    dispatch({
        type: HOME_PARTNERS_REQUEST
    });

    return fetchJson('/api/json/home-partners', {
        method: 'post'
    })
        .then(json => {
            dispatch(homePartnersSuccess(json));
        }, e => {
            dispatch(homePartnersFailure())
        })
    ;
};

export const homePartnersSuccess = data => ({
    type: HOME_PARTNERS_SUCCESS,
    payload: data
});

export const homePartnersFailure = () => ({
    type: HOME_PARTNERS_FAILURE
});

