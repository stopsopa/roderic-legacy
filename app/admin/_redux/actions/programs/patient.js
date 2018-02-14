
import {
    PROGRAMS_PATIENT_REQUEST,
    PROGRAMS_PATIENT_SUCCESS,
    PROGRAMS_PATIENT_FAILURE,
} from '../types';

import {
    fetchJson, fetchData, fetchCatch
} from '../../../transport';

export const programsPatientRequest = () => (dispatch, getState) => {

    dispatch({
        type: PROGRAMS_PATIENT_REQUEST
    });

    return fetchJson('/api/json/programs-patient', {
        method: 'post'
    })
        .then(json => {
            dispatch(programsPatientSuccess(json));
        }, e => {
            dispatch(programsPatientFailure())
        })
    ;
};

export const programsPatientSuccess = data => ({
    type: PROGRAMS_PATIENT_SUCCESS,
    payload: data
});

export const programsPatientFailure = () => ({
    type: PROGRAMS_PATIENT_FAILURE
});

