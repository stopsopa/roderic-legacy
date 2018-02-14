
import {
    HOME_INTRO_REQUEST,
    HOME_INTRO_SUCCESS,
    HOME_INTRO_FAILURE,
} from '../types';

import {
    fetchJson
} from '../../../transport';

export const homeIntroRequest = () => (dispatch, getState) => {

    dispatch({
        type: HOME_INTRO_REQUEST
    });

    return fetchJson('/api/json/home-intro', {
        method: 'post'
    })
        .then(json => {
            dispatch(homeIntroSuccess(json));
        }, e => {
            log('failure', e)
            dispatch(homeIntroFailure())
        })
    ;
};

export const homeIntroSuccess = data => ({
    type: HOME_INTRO_SUCCESS,
    payload: data
});

export const homeIntroFailure = () => ({
    type: HOME_INTRO_FAILURE
});

