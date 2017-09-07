
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TodoList from './TodoList';
import { getVisibleTodos } from '../reducers';

import { fetchTodos } from '../api';

class VisibleTodoList extends Component {
    componentDidMount() {
        log('this.props.filter', this.props.filter)
        fetchTodos(this.props.filter).then((todos) => {
            log('componentDidMount then', this.props.filter, todos)
        });
    }
    componentDidUpdate(prevProps) {
        if (this.props.filter !== prevProps.filter) {
            fetchTodos(this.props.filter).then((todos) => {
                log('componentDidUpdate then', this.props.filter, todos)
            });
        }
    }
    render() {
        return <TodoList {...this.props} />;
    }
}

const mapStateToProps = (state, { match }) => {
    return {
        todos: getVisibleTodos(
            state,
            match.params.filter
        ),
        filter: match.params.filter
    };
};

// action createor function
const toggleTodo = id => ({
    type: 'TOGGLE_TODO',
    id
});

VisibleTodoList = withRouter(connect(
    mapStateToProps,
    { onToggle : toggleTodo } // must have the same params in this case both (id)
)(VisibleTodoList));

export default VisibleTodoList;