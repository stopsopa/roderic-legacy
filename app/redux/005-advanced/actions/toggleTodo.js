
// action createor function
import * as api from '../api';

const toggleTodo = id => dispatch =>
    api.toggleTodo(id).then(response => {
        dispatch({
            type: 'TOGGLE_TODO_SUCCESS'
        })
    })

export default toggleTodo;