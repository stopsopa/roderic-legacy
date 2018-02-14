
import {
    PROGRAMS_PHYSICIAN_REQUEST,
    PROGRAMS_PHYSICIAN_SUCCESS,
    PROGRAMS_PHYSICIAN_FAILURE,
} from '../types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../../transport';

export const programsPhysicianRequest = () => (dispatch, getState) => {

    dispatch({
        type: PROGRAMS_PHYSICIAN_REQUEST
    });

    return fetchJson('/api/json/programs-physician', {
        method: 'post'
    })
        .then(json => {
            dispatch(programsPhysicianSuccess(json));
        }, e => {
            dispatch(programsPhysicianFailure())
        })
    ;
};

export const programsPhysicianSuccess = data => ({
    type: PROGRAMS_PHYSICIAN_SUCCESS,
    payload: data
});

export const programsPhysicianFailure = () => ({
    type: PROGRAMS_PHYSICIAN_FAILURE
});

