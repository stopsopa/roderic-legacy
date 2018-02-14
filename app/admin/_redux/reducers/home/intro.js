
import {
    HOME_INTRO_REQUEST,
    HOME_INTRO_SUCCESS,
    HOME_INTRO_FAILURE,
} from '../../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_INTRO_REQUEST:
            return state;
        case HOME_INTRO_SUCCESS:
            return action.payload;
        case HOME_INTRO_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getHomeIntro = state => state;

