
import {
    CONTACT_DETAILS_REQUEST,
    CONTACT_DETAILS_SUCCESS,
    CONTACT_DETAILS_FAILURE,
} from '../../actions/types';

export default (state = {
    offices: []
}, action) => {
    switch (action.type) {
        case CONTACT_DETAILS_REQUEST:
            return state;
        case CONTACT_DETAILS_SUCCESS:
            return action.payload;
        case CONTACT_DETAILS_FAILURE:
            return state;
        default:
            return state;
    }
}

export const getContactDetails = state => state;
