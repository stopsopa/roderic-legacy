
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TodoList from './TodoList';

// reducers
import { getVisibleTodos } from '../reducers';

// action createor function
import { fetchTodos } from '../actions/receiveTodos';

import toggleTodo from '../actions/toggleTodo';

class VisibleTodoList extends Component {
    componentDidMount() {

        this.fetchData();
    }
    componentDidUpdate(prevProps) {

        if (this.props.filter !== prevProps.filter) {

            this.fetchData();
        }
    }
    fetchData() {

        const { filter, fetchTodos } = this.props;

        fetchTodos(filter)
    }
    render() {

        const { onToggle, ...rest } = this.props;

        return <TodoList {...rest} onToggle={onToggle} />;
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

VisibleTodoList = withRouter(connect(
    mapStateToProps,
    { // must have the same params in this case both (id)
        onToggle : toggleTodo,
        fetchTodos
    }
)(VisibleTodoList));

export default VisibleTodoList;