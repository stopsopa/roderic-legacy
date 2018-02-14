
import {
    FOOTER_REQUEST,
    FOOTER_SUCCESS,
    FOOTER_FAILURE,
} from './types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../transport';

export const footerRequest = () => (dispatch, getState) => {

    dispatch({
        type: FOOTER_REQUEST
    });

    return fetchJson('/api/json/footer', {
        method: 'post'
    })
        .then(json => {
            dispatch(footerSuccess(json));
        }, e => {
            dispatch(footerFailure())
        })
    ;
};

export const footerSuccess = data => ({
    type: FOOTER_SUCCESS,
    payload: data
});

export const footerFailure = () => ({
    type: FOOTER_FAILURE
});

