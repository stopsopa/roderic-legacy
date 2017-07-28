'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

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

import { createStore } from 'redux';

const store = createStore(counter);

const View = ({value, onIncrement, onDecrement}) => (
    <div>
        <h4>{value}</h4>
        <button onClick={onIncrement}>+</button>
        <button onClick={onDecrement}>-</button>
    </div>
);

const render = () => {
    log('render');
    ReactDOM.render(
        <View
            value={store.getState()}
            onIncrement={() => store.dispatch({type:'INCREMENT'})}
            onDecrement={() => store.dispatch({type:'DECREMENT'})}
        />,
        document.getElementById('app')
    );
};

store.subscribe(render);
render();
