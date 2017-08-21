
import React from 'react';
import { connect } from 'react-redux';
import uuid4 from 'uuid/v4';

// this component doesn't know about behaviour
// specify only appearance of link
const Link = ({
      active,
      onClick,
      children
}) => {

    if (active) {

        return <span>{children}</span>;
    }

    return (
        <a href="javascript;"
           onClick={e => {
               e.preventDefault();
               onClick();
           }}
        >
            {children}
        </a>
    )
};

// https://egghead.io/lessons/javascript-redux-generating-containers-with-connect-from-react-redux-footerlink
const FilterLink = connect(
    (state, props) => {
        return {
            active: props.filter ===  state.visibilityFilter
        }
    },
    (dispatch, props) => {
        return {
            onClick: () => dispatch({
                type: 'SET_VISIBILITY_FILTER',
                filter: props.filter
            })
        };
    }
)(Link);

const Footer = () => (
    <p>
        Show:
        {' '}
        <FilterLink
            filter="SHOW_ALL"
        >All</FilterLink>
        {' '}
        <FilterLink
            filter="SHOW_ACTIVE"
        >Active</FilterLink>
        {' '}
        <FilterLink
            filter="SHOW_COMPLETED"
        >Completed</FilterLink>
    </p>
);

const Todo = ({
    onToggle,
    completed,
    text
}) => (
    <li
        onClick={() => onToggle()}
        style={{
            textDecoration:
                completed ?
                    'line-through' :
                    'none'
        }}
    >
        {text}
    </li>
);


const TodoList = ({
    todos,
    onToggle
}) => (
    <ul>
        {todos.map(todo =>
            <Todo
                key={todo.id}
                {...todo}
                onToggle={() => onToggle(todo.id)}
            />
        )}
    </ul>
);

const addTodo = (dispatch, value) => dispatch({
    type: 'ADD_TODO',
    text: value,
    id: uuid4()
});

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
// WARNING: so actually it is equvalent of connect()(TodoForm)

const App = () => (
    <div>
        <TodoForm />
        <VisibleTodoList />
        <Footer />
    </div>
);

export default App;