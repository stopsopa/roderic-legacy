'use strict';

// https://egghead.io/lessons/javascript-redux-implementing-store-from-scratch

const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}

function createStore(reducer) {
    let state;
    let listeners = [];
    const getState = () => state;
    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener())
    }
    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        }
    }
    dispatch({});
    return {getState, dispatch, subscribe};
}


// import { createStore } from 'redux';

const store = createStore(counter);

store.subscribe(() => {
    document.querySelector('pre').innerText = store.getState();
});

function render() {
    store.dispatch({type:'INCREMENT'});
};

document.addEventListener('click', render);
render();

// console.log('store', store.getState());
//
// store.dispatch({type:'INCREMENT'});
//
// console.log('store', store.getState());
//
// store.dispatch({type:'INCREMENT'});
//
// console.log('store', store.getState());
//
// store.dispatch({type:'DECREMENT'});
//
// console.log('store', store.getState());