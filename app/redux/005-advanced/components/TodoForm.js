
import React from 'react';
import { connect } from 'react-redux';

import addTodo from '../actions/addTodo';

let TodoForm = ({ dispatch }) => {
    let input;
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            addTodo(dispatch, input.value);
            input.value = '';
            input.focus();
        }}>
            <input ref={node => {
                input = node;
            }} />
            <button type="submit">
                Add Todo
            </button>
        </form>
    );
};
TodoForm = connect(
    // state => {
    //     return {}
    // },
    null, // this tells that there is no need to subscribe to the store
    // performance advantage

    // dispatch => {
    //     return { dispatch };
    // } // this is also common patter to return dispatcher only
    // that's why you can pass here also null and achieve this result by default
    null
)(TodoForm);

export default TodoForm;