
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TodoList from './TodoList';
import { getVisibleTodos } from '../reducers';


const mapStateToProps = (state, { match }) => {
    return {
        todos: getVisibleTodos(
            state,
            match.params.filter
        )
    };
};

// action createor function
const toggleTodo = id => ({
    type: 'TOGGLE_TODO',
    id
});

const VisibleTodoList = withRouter(connect(
    mapStateToProps,
    { onToggle : toggleTodo } // must have the same params in this case both (id)
)(TodoList));

export default VisibleTodoList;