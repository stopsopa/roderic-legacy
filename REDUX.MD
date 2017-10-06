state or state tree - single object that represent all state of app

REDUCER function need to be pure function
    - if you pass unknown action it should return old state (the same object);
    - it you changing something, you should return new object on the level where 
        you changing something but you don't need to make real copy of all state, 
        usually it is one level
    - REDUCER COMPOSITION   import { createStore, combineReducers } from 'redux';
            - combineReducers implementation https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
        https://egghead.io/lessons/javascript-redux-reducer-composition-with-arrays
        https://github.com/stopsopa/webpack3/blob/redux/app/redux/004-counters/redux-counters.entry.js#L73
        https://github.com/stopsopa/webpack3/blob/redux/app/redux/004-counters/redux-counters.entry.js#L76
        combining redusers to new reducer:
            https://egghead.io/lessons/javascript-redux-reducer-composition-with-objects
                this reducer calls other reducers to manage part of the state and 
                combines the states in the single state object
                examples:
                    redux: https://github.com/stopsopa/webpack3/blob/redux/app/redux/004-counters/redux-counters.entry.js#L124
                    manual: https://github.com/stopsopa/webpack3/blob/redux/app/redux/004-counters/redux-counters.entry.js#L110
        - convention: always name reducers after the state key they manage                    
    - if you pass to reducer as a STATE undefined then you need to return INITIAL STATE OF THE APPLICATIONS
    simpliest example:
    
    const counter = (state = 0, action) => {
        switch (action.type) {
            case "INCREMENT";
                return state + 1;
            case "DECREMENT";
                return state - 1;
            default:
                return state;
        }
    }
  
STORE - createStore() from Redux:
    - binds together three principles of redux
        - it holds CURRENT APPLICATION STATE OBJECT
        - it lets you dispatch ACTIONS
        - when you create it you need to specify REDUCER that describe STATE is updated with ACTIONS
    methods:
        - store.getState()
        - store.dispatch({type: ...}) 
        - store.subscribe(fn)  
    ENHANCER:
        function that overrides store.dispatch method in order to log or support promise actions
            more: https://egghead.io/lessons/javascript-redux-applying-redux-middleware
REDUCER COMPOSITION    
    PRESENTATIONAL COMPONENT (usually Dumb Components - function)
        why: https://egghead.io/lessons/javascript-redux-extracting-container-components-filterlink
            to avoid passing 
    and    
    CONTAINER COMPONENT
        generator 'connect' helper from 'react-redux' package
        
    TOP LEVEL REDUCER FILE:
        reducers/index.js
            # mentioned in https://egghead.io/lessons/javascript-redux-displaying-loading-indicators
        
ACTION CREATORS:        
    separate functions that maintain logic for dispatching event
    
        const toggleTodo = id => dispatch({
            type: 'TOGGLE_TODO',
            id
        });
SELECTOR:
    method that prepares the data to be displayed by ui
    https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers        
    selector because it select something from the current state
    
Stopped at:
https://egghead.io/lessons/javascript-redux-adding-react-router-to-the-project         

finished at:
    https://reacttraining.com/react-router/web/example/auth-workflow
    https://reacttraining.com/react-router/web/example/sidebar   