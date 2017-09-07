


// api
import * as api from '../api';

// action createor function
const receiveTodos = (filter, response) => ({
    type: 'RECEIVE_TODOS',
    filter,
    response
});

export const fetchTodos = filter => api.fetchTodos(filter).then(
    todos => {
        log('before receiveTodos')
        return receiveTodos(filter, todos)
    }
);

export default receiveTodos;