
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { autobind } from 'core-decorators';
import TodoList from './TodoList';
import FetchError from './FetchError';

import * as actions from '../actions';

// reducers
import { getVisibleTodos, getIsFetching, getErrorMessage } from '../reducers';

class VisibleTodoList extends Component {
    componentDidMount() {

        this.fetchData();
    }
    componentDidUpdate(prevProps) {

        if (this.props.filter !== prevProps.filter) {

            this.fetchData();
        }
    }
    @autobind
    fetchData() {

        const { filter, fetchTodos } = this.props;

        fetchTodos(filter).then(sent => log(`fetchTodo in VisibleTodoList, filter:'${filter}', status:'${sent}'`));
    }
    render() {

        const { toggleTodo, errorMessage, todos, isFetching } = this.props;

        if ( ! todos.length ) {

            if (isFetching) {

                return <p>Loading...</p>;
            }

            if (errorMessage) {

                return <FetchError
                    message={errorMessage}
                    onRetry={this.fetchData}
                />
            }
        }

        return <TodoList todos={todos} toggleTodo={toggleTodo} />;
    }
}

const mapStateToProps = (state, { match }) => {

    const filter = match.params.filter || 'all';

    return {
        todos: getVisibleTodos(
            state,
            filter
        ),
        errorMessage: getErrorMessage(state, filter),
        isFetching: getIsFetching(state, filter),
        filter: filter
    };
};

VisibleTodoList = withRouter(connect(
    mapStateToProps,
    actions
)(VisibleTodoList));

export default VisibleTodoList;