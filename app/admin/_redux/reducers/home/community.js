
import {
    HOME_COMMUNITY_REQUEST,
    HOME_COMMUNITY_SUCCESS,
    HOME_COMMUNITY_FAILURE,
} from '../../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_COMMUNITY_REQUEST:
            return state;
        case HOME_COMMUNITY_SUCCESS:
            return action.payload;
        case HOME_COMMUNITY_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getHomeCommunity = state => state;
