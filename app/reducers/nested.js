
import {
    NESTED_LOAD
} from '../actions';

const nested = (state = '', action) => {
    switch (action.type) {
        case NESTED_LOAD:
            return action.payload;
        default:
            return state;
    }
}

export default nested;

export const getNested = state => state;