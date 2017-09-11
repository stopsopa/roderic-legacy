
// action createor function

const toggleTodo = id => dispatch =>
    api.toggleTodo(id).then(response => {
        dispatch({
            type: 'TOGGLE_TODO_SUCCESS',
            response:
        })
    })

export default toggleTodo;