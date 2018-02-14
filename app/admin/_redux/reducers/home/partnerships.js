
import {
    HOME_PARTNERSHIPS_REQUEST,
    HOME_PARTNERSHIPS_SUCCESS,
    HOME_PARTNERSHIPS_FAILURE,
} from '../../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_PARTNERSHIPS_REQUEST:
            return state;
        case HOME_PARTNERSHIPS_SUCCESS:
            return action.payload;
        case HOME_PARTNERSHIPS_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getHomePartnerships = state => state;
