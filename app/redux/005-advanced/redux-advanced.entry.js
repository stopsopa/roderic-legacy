'use strict';

// https://egghead.io/lessons/javascript-redux-avoiding-array-mutations-with-concat-slice-and-spread

import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import log from '../../../react/webpack/logw';

import { createStore /*, combineReducers */ } from 'redux';
import { loadState, saveState } from './localStorage';
import debounce from 'lodash/debounce';

import todoApp from './reducers';

import App from './App';



const store = createStore(todoApp, loadState());

store.subscribe(debounce(() => {

    const state = store.getState();

    const { visibilityFilter, ...save } = state;

    log('sub', save)

    saveState(save);
}, 300))

// no need anymore to rerender this level every change
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('app')
);

// store.subscribe(render);
// render();
