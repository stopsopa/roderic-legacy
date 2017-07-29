'use strict';

// https://egghead.io/lessons/javascript-redux-avoiding-array-mutations-with-concat-slice-and-spread

import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

import { createStore /*, combineReducers */ } from 'redux';

const addCounter = () => {
    return [...list, 0];
}

const removeCounter = (list, index) => {
    return [
        ...list.slice(0, index),
        ...list.slice(index + 1)
    ];
}

const incrementCounter = (list, index) => {
    return [
        ...list.slice(0, index),
        list[index] + 1,
        ...list.slice(index + 1)
    ];
}

// https://egghead.io/lessons/javascript-redux-avoiding-object-mutations-with-object-assign-and-spread
const toggleTodo = (todo) => {
    // return Object.assign({}, todo, {
    //     completed: !todo.completed
    // });
    return {
        ...todo,
        completed: !todo.completed
    }

}

// https://egghead.io/lessons/javascript-redux-reducer-composition-with-arrays
const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':{
            if (state.id !== action.id) {
                return state;
            }
            return {
                ...state,
                completed: !state.completed
            }
        }
        default:
            return state;
    }
}

// https://egghead.io/lessons/javascript-redux-writing-a-todo-list-reducer-adding-a-todo
const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ]
        case 'TOGGLE_TODO':
            return state.map(item => todo(item, action))
        default:
            return state;
    }
};

const visibilityFilter = (
    state = 'SHOW_ALL',
    action
) => {
    switch (action.type) {
        case "SET_VISIBILITY_FILTER":
            return action.filter;
        default:
            return state;
    }
};

// https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
function combineReducers(reducers) {
    return (state = {}, action) => {
        return Object.keys(reducers).reduce(
            (nextState, key) => {
                nextState[key] = reducers[key](
                    state[key],
                    action
                )
                return nextState;
            },
            {}
        )
    }
}

// const todoApp = (state = {}, action) => {
//     return {
//         todos: todos(
//             state.todos,
//             action
//         ),
//         visibilityFilter: visibilityFilter(
//             state.visibilityFilter,
//             action
//         )
//     }
// };

// shorter version using buildin helper
const todoApp = combineReducers({
    todos,
    visibilityFilter
});

// https://egghead.io/lessons/javascript-redux-reducer-composition-with-objects
(() => {
    const app = createStore(todoApp);

    function render () {
        log('state', JSON.stringify(app.getState(), null, '    '));
    }
    app.subscribe(render);
    render();
    app.dispatch({
        type: 'ADD_TODO',
        id: 0,
        text: 'first'
    });
    app.dispatch({
        type: 'ADD_TODO',
        id: 1,
        text: 'second'
    });

})();


(() => {
    const stateBefore = [];
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
    };

    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        }
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
})();

(() => {
    const stateBefore = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: false
        }
    ];
    const action = {
        type: 'TOGGLE_TODO',
        id: 1
    };

    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: true
        }
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
})();

// second reducer this type
const store = createStore(todoApp);

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

const FilterLink = ({
    filter,
    currentFilter,
    children
}) => {

    if (currentFilter === filter) {

        return <span>{children}</span>;
    }

    return (
        <a href="javascript;"
            onClick={e => {
                e.preventDefault();
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter
                });
            }}
        >
            {children}
        </a>
    )
};

let nextTodoId = 0;

class TodoApp extends React.Component {
    render() {
        const {todos, visibilityFilter} = this.props;
        const todosFiltered = getVisibleTodos(todos, visibilityFilter);
        return (
            <form onSubmit={(e) => {
                e.preventDefault();
                store.dispatch({
                    type: 'ADD_TODO',
                    text: this.input.value,
                    id: nextTodoId++
                });
                this.input.value = '';
            }}>
                <input ref={node => {
                    this.input = node;
                }} />
                <button type="submit">
                    Add Todo
                </button>
                <ul>
                    {todosFiltered.map(todo =>
                        <li
                            key={todo.id}
                            style={{
                                textDecoration:
                                    todo.completed ?
                                        'line-through' :
                                        'none'
                            }}
                            onClick={() => {
                                store.dispatch({
                                    type: 'TOGGLE_TODO',
                                    id: todo.id
                                });
                            }}
                        >
                            {todo.text}
                        </li>
                    )}
                </ul>
                <p>
                    Show:
                    {' '}<FilterLink filter="SHOW_ALL" currentFilter={visibilityFilter}>All</FilterLink>
                    {' '}<FilterLink filter="SHOW_ACTIVE" currentFilter={visibilityFilter}>Active</FilterLink>
                    {' '}<FilterLink filter="SHOW_COMPLETED" currentFilter={visibilityFilter}>Completed</FilterLink>
                </p>
            </form>
        );
    }
}

const render = (() => {
    const div = document.getElementById('app');
    return () => {
        log('render');
        ReactDOM.render(
            <TodoApp {...store.getState()} />,
            div
        );
    }
})()

store.subscribe(render);
render();
