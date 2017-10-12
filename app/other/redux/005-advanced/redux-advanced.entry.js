'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import log from '../../../../react/webpack/logw';
import configureStore from './configureStore';

import Root from './components/Root';

import './css/style.scss';

const store = configureStore();

ReactDOM.render(
    <Root store={store} />,
    document.getElementById('app')
);

