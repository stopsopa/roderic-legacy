
import todo from './todo';

import { combineReducers } from 'redux';

// reducer
// https://egghead.io/lessons/javascript-redux-writing-a-todo-list-reducer-adding-a-todo
const byId = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_TODO':
        case 'TOGGLE_TODO':
            return {
                ...state,
                [action.id]: todo(state[action.id], action)
            }
        default:
            return state;
    }
};

const addIds = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [ ...state, action.id ];
        default:
            return state;
    }
}

const todos = combineReducers({
    byId,
    addIds
})

export default todos;

const getAllTodos = state => {
    const data = state.addIds.map(id => state.byId[id]);

    log('stae', state);
    return data;
}

// selector
// https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers
export const getVisibleTodos = (
    state,
    filter
) => {
    const allTodos = getAllTodos(state);
    switch (filter) {
        case 'completed':
            return allTodos.filter(t => t.completed)
        case 'active':
            return allTodos.filter(t => !t.completed)
        case 'all':
        default:
            return allTodos;
    }
};