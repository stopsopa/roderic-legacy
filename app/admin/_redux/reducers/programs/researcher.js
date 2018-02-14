
import {
    PROGRAMS_RESEARCHER_REQUEST,
    PROGRAMS_RESEARCHER_SUCCESS,
    PROGRAMS_RESEARCHER_FAILURE,
} from '../../actions/types';

export default (state = {
    services: []
}, action) => {
    switch (action.type) {
        case PROGRAMS_RESEARCHER_REQUEST:
            return state;
        case PROGRAMS_RESEARCHER_SUCCESS:
            return action.payload;
        case PROGRAMS_RESEARCHER_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getProgramsResearcher = state => state;
