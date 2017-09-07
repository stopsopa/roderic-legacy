
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TodoList from './TodoList';

// reducers
import { getVisibleTodos } from '../reducers';

// action createor function
import receiveTodos from '../actions/receiveTodos';
import toggleTodo from '../actions/toggleTodo';

// api
import { fetchTodos } from '../api';

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

        const { filter, receiveTodos } = this.props;

        fetchTodos(filter).then((todos) => {

            receiveTodos(filter, todos);
        });
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
        receiveTodos
    }
)(VisibleTodoList));

export default VisibleTodoList;