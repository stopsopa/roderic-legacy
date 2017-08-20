state or state tree - single object that represent all state of app

REDUCER function need to be pure function
    - if you pass unknown action it should return old state (the same object);
    - it you changing something, you should return new object on the level where 
        you changing something but you don't need to make real copy of all state, 
        usually it is one level
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
REDUCER COMPOSITION    
    PRESENTATIONAL COMPONENT (usually Dumb Components - function)
    and    
    CONTAINER COMPONENT
        generator 'connect' helper from 'react-redux' package
        
I STOPPED ON https://egghead.io/lessons/javascript-redux-extracting-action-creators        