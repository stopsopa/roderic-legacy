
import React from 'react';
import { connect } from 'react-redux';

import TodoList from './TodoList';

const getVisibleTodos = (
    todos,
    filter
) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed)
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed)
    }
};

const mapStateToProps = (state) => {
    return {
        todos: getVisibleTodos(
            state.todos,
            state.visibilityFilter
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