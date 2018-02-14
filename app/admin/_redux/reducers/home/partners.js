
import {
    HOME_PARTNERS_REQUEST,
    HOME_PARTNERS_SUCCESS,
    HOME_PARTNERS_FAILURE,
} from '../../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_PARTNERS_REQUEST:
            return state;
        case HOME_PARTNERS_SUCCESS:
            return action.payload;
        case HOME_PARTNERS_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getHomePartners = state => state;
