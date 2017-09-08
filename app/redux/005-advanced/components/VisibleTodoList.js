
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TodoList from './TodoList';

// reducers
import { getVisibleTodos, getIsFetching } from '../reducers';

// action createor function
import { fetchTodos } from '../actions/receiveTodos';

// action createor function
import requestTodos from '../actions/requestTodos';

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

        const { filter, requestTodos, fetchTodos } = this.props;

        requestTodos(filter);

        fetchTodos(filter);
    }
    render() {


        const { onToggle, todos, isFetching } = this.props;

        if (isFetching && !todos.length) {

            return <p>Loading...</p>;
        }

        return <TodoList todos={todos} onToggle={onToggle} />;
    }
}

const mapStateToProps = (state, { match }) => {

    const filter = match.params.filter;

    return {
        todos: getVisibleTodos(
            state,
            filter
        ),
        isFetching: getIsFetching(state, filter),
        filter: filter
    };
};

VisibleTodoList = withRouter(connect(
    mapStateToProps,
    { // must have the same params in this case both (id)
        onToggle : toggleTodo,
        fetchTodos,
        requestTodos
    }
)(VisibleTodoList));

export default VisibleTodoList;