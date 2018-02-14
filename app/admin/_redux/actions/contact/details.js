
import {
    CONTACT_DETAILS_REQUEST,
    CONTACT_DETAILS_SUCCESS,
    CONTACT_DETAILS_FAILURE,
} from '../types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../../transport';

export const contactDetailsRequest = () => (dispatch, getState) => {

    dispatch({
        type: CONTACT_DETAILS_REQUEST
    });

    return fetchJson('/api/json/contact-details', {
        method: 'post'
    })
        .then(json => {
            dispatch(contactDetailsSuccess(json));
        }, e => {
            dispatch(contactDetailsFailure())
        })
    ;
};

export const contactDetailsSuccess = data => ({
    type: CONTACT_DETAILS_SUCCESS,
    payload: data
});

export const contactDetailsFailure = () => ({
    type: CONTACT_DETAILS_FAILURE
});

