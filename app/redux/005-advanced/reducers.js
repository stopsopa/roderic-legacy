
import { createStore /*, combineReducers */ } from 'redux';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

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

export default todoApp;