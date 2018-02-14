
import {
    FOOTER_REQUEST,
    FOOTER_SUCCESS,
    FOOTER_FAILURE,
} from '../actions/types';

export default (state = {
    links: []
}, action) => {
    switch (action.type) {
        case FOOTER_REQUEST:
            return state;
        case FOOTER_SUCCESS:
            return action.payload;
        case FOOTER_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getFooter = state => state;
