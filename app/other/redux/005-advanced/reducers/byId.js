
const byId = (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_TODOS_SUCCESS':
            const nextState = { ...state };
            action.response.forEach(todo => {
                nextState[todo.id] = todo;
            })
            return nextState;
        case 'ADD_TODO_SUCCESS':
            const todo = action.response;
            return {
                ...state,
                [todo.id]: todo
            };
        default:
            return state;
    }
};

export default byId;

// selector
export const getTodo = (state, id) => state[id];

