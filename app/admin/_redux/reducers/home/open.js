
import {
    HOME_OPEN_REQUEST,
    HOME_OPEN_SUCCESS,
    HOME_OPEN_FAILURE,
} from '../../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_OPEN_REQUEST:
            return state;
        case HOME_OPEN_SUCCESS:
            return action.payload;
        case HOME_OPEN_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getHomeOpen = state => state;
