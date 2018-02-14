
import {
    PROGRAMS_PATIENT_REQUEST,
    PROGRAMS_PATIENT_SUCCESS,
    PROGRAMS_PATIENT_FAILURE,
} from '../../actions/types';

export default (state = {
    services: {
        name: '',
        list: []
    }
}, action) => {
    switch (action.type) {
        case PROGRAMS_PATIENT_REQUEST:
            return state;
        case PROGRAMS_PATIENT_SUCCESS:
            return action.payload;
        case PROGRAMS_PATIENT_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getProgramsPatient = state => state;
