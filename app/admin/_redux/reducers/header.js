
import {
    HEADER_REQUEST,
    HEADER_SUCCESS,
    HEADER_FAILURE,
} from '../actions/types';

export default (state = {
    nav: []
}, action) => {
    switch (action.type) {
        case HEADER_REQUEST:
            return state;
        case HEADER_SUCCESS:
            return action.payload;
        case HEADER_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getHeader = state => state;
