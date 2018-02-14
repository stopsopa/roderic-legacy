
import {
    PROGRAMS_RESEARCHER_REQUEST,
    PROGRAMS_RESEARCHER_SUCCESS,
    PROGRAMS_RESEARCHER_FAILURE,
} from '../types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../../transport';

export const programsResearcherRequest = () => (dispatch, getState) => {

    dispatch({
        type: PROGRAMS_RESEARCHER_REQUEST
    });

    return fetchJson('/api/json/programs-researcher', {
        method: 'post'
    })
        .then(json => {
            dispatch(programsResearcherSuccess(json));
        }, e => {
            dispatch(programsResearcherFailure())
        })
    ;
};

export const programsResearcherSuccess = data => ({
    type: PROGRAMS_RESEARCHER_SUCCESS,
    payload: data
});

export const programsResearcherFailure = () => ({
    type: PROGRAMS_RESEARCHER_FAILURE
});

