


// api
import * as api from '../api';
import requestTodos from './requestTodos';

// action createor function
const receiveTodos = (filter, response) => ({
    type: 'RECEIVE_TODOS',
    filter,
    response
});

export const fetchTodos = filter => dispatch => {

    dispatch(requestTodos(filter));

    api.fetchTodos(filter).then(todos => {
        filter = filter || 'all';
        dispatch(receiveTodos(filter, todos))
    })
}

export default receiveTodos;