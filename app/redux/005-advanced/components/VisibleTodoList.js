
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TodoList from './TodoList';

const getVisibleTodos = (
    todos,
    filter
) => {
    switch (filter) {
        case 'completed':
            return todos.filter(t => t.completed)
        case 'active':
            return todos.filter(t => !t.completed)
        case 'all':
        default:
            return todos;
    }
};

const mapStateToProps = (state, { match }) => {
    return {
        todos: getVisibleTodos(
            state.todos,
            match.params.filter
        )
    };
};

// action createor function
const toggleTodo = id => ({
    type: 'TOGGLE_TODO',
    id
});

const mapDspatchToProps = (dispatch) => {
    return {
        onToggle: (id) => {
            dispatch(toggleTodo(id));
        }
    }
};

const VisibleTodoList = withRouter(connect(
    mapStateToProps,
    mapDspatchToProps
)(TodoList));

export default VisibleTodoList;