
import {
    HOME_INDEPENDENT_REQUEST,
    HOME_INDEPENDENT_SUCCESS,
    HOME_INDEPENDENT_FAILURE,
} from '../../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_INDEPENDENT_REQUEST:
            return state;
        case HOME_INDEPENDENT_SUCCESS:
            return action.payload;
        case HOME_INDEPENDENT_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getHomeIndependent = state => state;
