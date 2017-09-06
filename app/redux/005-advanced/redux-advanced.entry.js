'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import log from '../../../react/webpack/logw';
import configureStore from './configureStore';

import './css/style.scss';

import Root from './components/Root';

ReactDOM.render(
    <Root store={configureStore()} />,
    document.getElementById('app')
);

