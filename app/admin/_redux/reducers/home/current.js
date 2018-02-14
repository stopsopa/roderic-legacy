
import {
    HOME_CURRENT_REQUEST,
    HOME_CURRENT_SUCCESS,
    HOME_CURRENT_FAILURE,
} from '../../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_CURRENT_REQUEST:
            return state;
        case HOME_CURRENT_SUCCESS:
            return action.payload;
        case HOME_CURRENT_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getHomeCurrent = state => state;
