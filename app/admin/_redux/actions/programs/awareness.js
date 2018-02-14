
import {
    PROGRAMS_AWARENESS_REQUEST,
    PROGRAMS_AWARENESS_SUCCESS,
    PROGRAMS_AWARENESS_FAILURE,
} from '../types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../../transport';

export const programsAwarenessRequest = () => (dispatch, getState) => {

    dispatch({
        type: PROGRAMS_AWARENESS_REQUEST
    });

    return fetchJson('/api/json/programs-awareness', {
        method: 'post'
    })
        .then(json => {
            dispatch(programsAwarenessSuccess(json));
        }, e => {
            dispatch(programsAwarenessFailure())
        })
    ;
};

export const programsAwarenessSuccess = data => ({
    type: PROGRAMS_AWARENESS_SUCCESS,
    payload: data
});

export const programsAwarenessFailure = () => ({
    type: PROGRAMS_AWARENESS_FAILURE
});

