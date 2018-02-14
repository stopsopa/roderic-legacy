
import {
    HOME_AGILE_REQUEST,
    HOME_AGILE_SUCCESS,
    HOME_AGILE_FAILURE,
} from '../../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_AGILE_REQUEST:
            return state;
        case HOME_AGILE_SUCCESS:
            return action.payload;
        case HOME_AGILE_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getHomeAgile = state => state;
