
import todo from './todo';

// reducer
// https://egghead.io/lessons/javascript-redux-writing-a-todo-list-reducer-adding-a-todo
const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ]
        case 'TOGGLE_TODO':
            return state.map(item => todo(item, action))
        default:
            return state;
    }
};

export default todos;

// selector
// https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers
export const getVisibleTodos = (
    state,
    filter
) => {
    switch (filter) {
        case 'completed':
            return state.filter(t => t.completed)
        case 'active':
            return state.filter(t => !t.completed)
        case 'all':
        default:
            return state;
    }
};