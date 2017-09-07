
// action createor function
import uuid4 from 'uuid/v4';

const addTodo = (dispatch, value) => dispatch({
    type: 'ADD_TODO',
    text: value,
    id: uuid4()
});

export default addTodo;