'use strict';

// https://egghead.io/lessons/javascript-redux-avoiding-array-mutations-with-concat-slice-and-spread

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
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
    todos, // Object Literal Shorthand Syntax
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


// CONTAINER COMPONENT, CAN BE GENERATED
// this component doesn't know about appearance
// but provide data and behaviour
// class FilterLink extends React.Component {
//     // do this always you want to call directly
//     // store.getState();
//     componentDidMount() {
//         const { store } = this.context;
//         log('componentDidMount')
//         this.unsubscribe = store.subscribe(
//             () => this.forceUpdate()
//         );
//     }
//     componentWillUnmount() {
//         log('componentWillUnmount')
//         this.unsubscribe();
//     }
//     render() {
//         const props = this.props;
//         const { store } = this.context;
//         const state = store.getState();
//
//         return (
//             <Link
//                 active={
//                     props.filter ===
//                     state.visibilityFilter
//                 }
//                 onClick={() => store.dispatch({
//                     type: 'SET_VISIBILITY_FILTER',
//                     filter: props.filter
//                 })}
//             >{props.children}</Link>
//         );
//     }
// }
// FilterLink.contextTypes = {
//     store: PropTypes.object
// }

const Todo = ({
    toggleTodo,
    completed,
    text
}) => (
    <li
        onClick={() => toggleTodo()}
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

let TodoForm = ({ dispatch }) => {
    let input;
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            dispatch({
                type: 'ADD_TODO',
                text: input.value,
                id: nextTodoId++
            })
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

import { connect } from 'react-redux';

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


const TodoList = ({
    todos,
    toggleTodo
}) => (
    <ul>
        {todos.map(todo =>
            <Todo
                key={todo.id}
                {...todo}
                toggleTodo={() => toggleTodo(todo.id)}
            />
        )}
    </ul>
);

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

// you don't need to build it on your own because you can use also
// external library react-redux
// https://egghead.io/lessons/javascript-redux-passing-the-store-down-with-provider-from-react-redux
// WARNING can create only 'store' context property
import { Provider } from 'react-redux';

// class Provider extends React.Component {
//     getChildContext() {
//         return {
//             store: this.props.store
//         };
//     }
//     render() {
//         return this.props.children;
//     }
// }
//
// // context that we want to pass down
// Provider.childContextTypes = {
//     store: PropTypes.object
// };

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
            toggleTodo: (id) => {
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

    // instead of writing this class manually we can now generate it by
    // just specifying how to transform data from 'store' to props of TodoList
    // and how to bind events with dispatcher in TodoList
    // to do that use 'connect' helper form react-redux package
    // https://egghead.io/lessons/javascript-redux-generating-containers-with-connect-from-react-redux-visibletodolist

    // in my own words
    //      this is generating CONTAINER COMPONENT from presentationAL component
    //      using react-redux connect helper

    // proper container component that subscribes to the store
    // and rerender ToolList every time the store state is changing
    // class VisibleTodoList extends React.Component {
    //     // do this always you want to call directly
    //     // store.getState();
    //     componentDidMount() {
    //         const { store } = this.context;
    //         log('componentDidMount')
    //         this.unsubscribe = store.subscribe(
    //             () => this.forceUpdate()
    //         );
    //     }
    //     componentWillUnmount() {
    //         log('componentWillUnmount')
    //         this.unsubscribe();
    //     }
    //     render() {
    //         const { store } = this.context;
    //         const state = store.getState();
    //
    //         return (
    //             <TodoList
    //                 todos={getVisibleTodos(
    //                     state.todos,
    //                     state.visibilityFilter
    //                 )}
    //                 toggleTodo={id => store.dispatch({
    //                     type: 'TOGGLE_TODO',
    //                     id
    //                 })}
    //             />
    //         );
    //     }
    // }
    // // context that we want receive
    // VisibleTodoList.contextTypes = {
    //     store: PropTypes.object
    // };


let nextTodoId = 0;

// second reducer this type

const TodoApp = () => (
    <div>
        <TodoForm />
        <VisibleTodoList />
        <Footer />
    </div>
);

// const render = (() => {
//     const div = document.getElementById('app');
//     return () => {
//         log('render');
//         ReactDOM.render(
//             <TodoApp {...store.getState()} />,
//             div
//         );
//     }
// })()

// no need anymore to rerender this level every change
ReactDOM.render(
    <Provider store={createStore(todoApp /* ,default data */)}>
        <TodoApp/>
    </Provider>,
    document.getElementById('app')
);

// store.subscribe(render);
// render();
