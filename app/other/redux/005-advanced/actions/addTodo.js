
// action createor function

import * as api from '../api';

const addTodo = (text) => {
    return (dispatch) => {
        api.addTodo(text).then(response => {
            dispatch({
                type: 'ADD_TODO_SUCCESS',
                response
            });
        })
    }
}

;

export default addTodo;