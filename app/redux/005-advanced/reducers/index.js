
import { createStore /*, combineReducers */ } from 'redux';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

import todos from './todos';

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