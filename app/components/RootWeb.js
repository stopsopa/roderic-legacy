
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PropTypes from 'prop-types';

import Root from './Root';

import '../pages/index.scss';

import 'semantic-ui-css/semantic.min.css';

const RootWeb = ({ store }) => (
    <Provider store={store}>
        <Router>
            <Root />
        </Router>
    </Provider>
);

RootWeb.propTypes = {
    store: PropTypes.object.isRequired
}

export default RootWeb;