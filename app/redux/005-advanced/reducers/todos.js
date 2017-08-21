
import todo from './todo';

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