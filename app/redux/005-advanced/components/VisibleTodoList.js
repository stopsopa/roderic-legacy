
import React from 'react';
import { connect } from 'react-redux';
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

const mapStateToProps = (state, ownProps) => {
    return {
        todos: getVisibleTodos(
            state.todos,
            ownProps.filter
        )
    };
};

const mapDspatchToProps = (dispatch) => {
    return {
        onToggle: (id) => {
            dispatch({
                type: 'TOGGLE_TODO',
                id
            });
        }
    }
};

const VisibleTodoList = connect(
    mapStateToProps,
    mapDspatchToProps
)(TodoList);

export default VisibleTodoList;