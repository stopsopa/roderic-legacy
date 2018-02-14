
import {
    HOME_ADVISORS_REQUEST,
    HOME_ADVISORS_SUCCESS,
    HOME_ADVISORS_FAILURE,
} from '../../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_ADVISORS_REQUEST:
            return state;
        case HOME_ADVISORS_SUCCESS:
            return action.payload;
        case HOME_ADVISORS_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getHomeAdvisors = state => state;
