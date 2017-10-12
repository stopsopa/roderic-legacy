
// api
import * as api from '../api';
import { getIsFetching } from '../reducers';

export const fetchTodos = (filter = 'all') => (dispatch, getState) => {

    if (getIsFetching(getState(), filter)) {

        return Promise.resolve('cancel');
    }

    dispatch({
        type: 'FETCH_TODOS_REQUEST',
        filter
    });

    return api.fetchTodos(filter).then(
        response => {
            dispatch({
                type: 'FETCH_TODOS_SUCCESS',
                filter,
                response
            })
            return 'success';
        },
        error => {
            dispatch({
                type: 'FETCH_TODOS_FAILURE',
                filter,
                message: error || 'Something went wrong.'
            });
            return 'failure';
        }
    )
}

export default fetchTodos;