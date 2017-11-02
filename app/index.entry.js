'use strict';

import React from 'react';

import ReactDOM, { render } from 'react-dom';

import 'normalize-css';

import WebRoot from './components/RootWeb';

import configureStore from './configureStore';

import configPublic from './public.config';

import { loginError, loginSuccess } from './actions';

const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

const store = configureStore(preloadedState);


// authentication
(function () {

    let token, reloadToChangePostRequestToRegularGet = false;

    if (window.__JWT_TOKEN__ !== undefined) {

        token = window.__JWT_TOKEN__;

        delete window.__JWT_TOKEN__;

        reloadToChangePostRequestToRegularGet = true;
    }

    if (token === undefined) {

        token = localStorage.getItem(configPublic.jwt.localStorageKey) || undefined;
    }

    if (token) {

        store.dispatch(loginSuccess(token));

        if (reloadToChangePostRequestToRegularGet) {

            location.href = location.href;
        }
    }

    if (token === false) {
        // to prevent error: React attempted to reuse markup in a container but the checksum was invalid
        setTimeout(() => store.dispatch(loginError("Unrecognized username or password")), 0);
    }
}());

render(
    <WebRoot store={store} />,
    document.getElementById('app')
);

if (/app_dev\.php/.test(location.href)) {
    document.body.classList.add('dev');
}
