
import {
    PROGRAMS_PHYSICIAN_REQUEST,
    PROGRAMS_PHYSICIAN_SUCCESS,
    PROGRAMS_PHYSICIAN_FAILURE,
} from '../../actions/types';

export default (state = {
    services: {
        name: '',
        list: []
    }
}, action) => {
    switch (action.type) {
        case PROGRAMS_PHYSICIAN_REQUEST:
            return state;
        case PROGRAMS_PHYSICIAN_SUCCESS:
            return action.payload;
        case PROGRAMS_PHYSICIAN_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getProgramsPhysician = state => state;
