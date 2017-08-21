'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import log from '../../../react/webpack/logw';
import configureStore from './configureStore';

ReactDOM.render(
    <Provider store={configureStore()}>
        <App/>
    </Provider>,
    document.getElementById('app')
);
