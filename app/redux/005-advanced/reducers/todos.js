
import { combineReducers } from 'redux';

// reducer
// https://egghead.io/lessons/javascript-redux-writing-a-todo-list-reducer-adding-a-todo
const byId = (state = {}, action) => {
    switch (action.type) {
        case 'RECEIVE_TODOS':
            const nextState = { ...state };
            action.response.forEach(todo => {
                nextState[todo.id] = todo;
            })
            return nextState;
        default:
            return state;
    }
};

const allIds = (state = [], action) => {

    if (action.filter !== 'all') {

        return state;
    }

    switch (action.type) {
        case 'RECEIVE_TODOS':
            return action.response.map(d => d.id);
        default:
            return state;
    }
}

const activeIds = (state = [], action) => {

    if (action.filter !== 'active') {

        return state;
    }

    switch (action.type) {
        case 'RECEIVE_TODOS':
            return action.response.map(d => d.id);
        default:
            return state;
    }
}

const completedIds = (state = [], action) => {

    if (action.filter !== 'completed') {

        return state;
    }

    switch (action.type) {
        case 'RECEIVE_TODOS':
            return action.response.map(d => d.id);
        default:
            return state;
    }
}

const todos = combineReducers({
    byId,
    idsByFilter: combineReducers({
        all: allIds,
        active: activeIds,
        completed: completedIds
    })
})

export default todos;

// selector
// https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers
export const getVisibleTodos = (
    state,
    filter
) => {
    filter = filter || 'all';
    const ids = state.idsByFilter[filter];
    return ids.map(id => state.byId[id]);
};