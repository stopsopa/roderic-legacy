'use strict';

import React from 'react';
import ReactDOM, { render } from 'react-dom';

import 'normalize-css';

import './pages/index.scss';

import 'semantic-ui-css/semantic.min.css';

import WebRoot from './components/RootWeb';

import configureStore from './configureStore';

const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

const store = configureStore(preloadedState);

console.log('after init', store.getState());

render(
    <WebRoot store={store} />,
    document.getElementById('app')
);

if (/app_dev\.php/.test(location.href)) {
    document.body.classList.add('dev');
}
