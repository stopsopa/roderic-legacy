
import {
    PROGRAMS_AWARENESS_REQUEST,
    PROGRAMS_AWARENESS_SUCCESS,
    PROGRAMS_AWARENESS_FAILURE,
} from '../../actions/types';

export default (state = {
    services: {
        name: '',
        list: []
    }
}, action) => {
    switch (action.type) {
        case PROGRAMS_AWARENESS_REQUEST:
            return state;
        case PROGRAMS_AWARENESS_SUCCESS:
            return action.payload;
        case PROGRAMS_AWARENESS_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getProgramsAwareness = state => state;
