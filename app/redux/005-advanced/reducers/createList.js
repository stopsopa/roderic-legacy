
import { combineReducers } from 'redux';

// reducer
const createList = filter => {

    const ids = (state = [], action) => {

        if (action.filter !== filter) {

            return state;
        }

        switch (action.type) {
            case 'RECEIVE_TODOS':
                return action.response.map(d => d.id);
            default:
                return state;
        }
    }

    const isFetching = (state = false, action) => {

        if (action.filter !== filter) {

            return state;
        }

        switch (action.type) {
            case 'REQUEST_TODOS':
                return true;
            case 'RECEIVE_TODOS':
                return false;
            default:
                return state;
        }
    }

    return combineReducers({
        ids,
        isFetching
    });
}

//
export default createList;

// this reducer (this file) gonna keep tracking both fields 'ids' and 'isFetching' using combineReducers()

// selector
export const getIds = state => state.ids;

// selector.
export const getIsFetching = state => state.isFetching;

