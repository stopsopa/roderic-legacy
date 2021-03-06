
import { combineReducers } from 'redux';

// reducer
const createList = filter => {

    const ids = (state = [], action) => {

        switch (action.type) {
            case 'FETCH_TODOS_SUCCESS':
                return filter === action.filter
                    ? action.response.map(d => d.id)
                    : state;
            case 'ADD_TODO_SUCCESS':
                return filter === 'completed'
                    ? state
                    : [...state, action.response.id]
            case 'TOGGLE_TODO_SUCCESS':
                return [ ...state ]; // just to trigger refresh
            default:
                return state;
        }
    }

    const isFetching = (state = false, action) => {

        if (action.filter !== filter) {

            return state;
        }

        switch (action.type) {
            case 'FETCH_TODOS_REQUEST':
                return true;
            case 'FETCH_TODOS_SUCCESS':
            case 'FETCH_TODOS_FAILURE':
                return false;
            default:
                return state;
        }
    }

    const errorMessage = (state = null, action) => {

        if (action.filter !== filter) {

            return state;
        }

        switch (action.type) {
            case 'FETCH_TODOS_FAILURE':
                return action.message;
            case 'FETCH_TODOS_SUCCESS':
            case 'FETCH_TODOS_REQUEST':
                return null;
            default:
                return state;
        }
    }

    return combineReducers({
        ids,
        isFetching,
        errorMessage
    });
}

//
export default createList;

// this reducer (this file) gonna keep tracking both fields 'ids' and 'isFetching' using combineReducers()

// selectors
export const getIds = state => state.ids;

export const getIsFetching = state => state.isFetching;

export const getErrorMessage = state => state.errorMessage;

