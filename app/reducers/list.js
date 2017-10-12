
import { combineReducers } from 'redux';

import {
    FETCH_LIST_SUCCESS,
    LIST_DELETE_SHOW,
    LIST_DELETE_DELETE,
    LIST_DELETE_CANCEL
} from '../actions';

const byId = (state = {}, action) => {

    switch (action.type) {

        case FETCH_LIST_SUCCESS:

            const nextState = { ...state };

            action.list.forEach(task => {
                nextState[task._id] = task;
            });

            return nextState;
        default:
            return state;
    }
};

const ids = (state = [], action) => {
    switch (action.type) {
        case FETCH_LIST_SUCCESS:
            return action.list.map(task => task._id);
        default:
            return state;
    }
}

const del = (state = null, action) => {
    switch (action.type) {
        case LIST_DELETE_SHOW:
            return action.id;
        case LIST_DELETE_CANCEL:
        case LIST_DELETE_DELETE:
            return null;
        default:
            return state;
    }
}

export default combineReducers({
    byId,
    ids,
    del
});

export const getIds = state => state.ids;

export const getById = (state, id) => state.byId[id];

export const getDel = state => state.del;