


// api
import * as api from '../api';
import requestTodos from './requestTodos';
import { getIsFetching } from '../reducers';

// action createor function
const receiveTodos = (filter, response) => ({
    type: 'RECEIVE_TODOS',
    filter,
    response
});

export const fetchTodos = (filter = 'all') => (dispatch, getState) => {

    if (getIsFetching(getState(), filter)) {

        return Promise.resolve(false);
    }

    dispatch(requestTodos(filter));

    return api.fetchTodos(filter).then(todos => {
        dispatch(receiveTodos(filter, todos))
        return true;
    })
}

export default receiveTodos;