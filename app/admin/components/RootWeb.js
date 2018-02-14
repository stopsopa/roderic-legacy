
import React from 'react';

import { Provider } from 'react-redux';

import { BrowserRouter as Router, Route } from 'react-router-dom'

import PropTypes from 'prop-types';

import 'bootstrap/dist/css/bootstrap.css'; // it works
// import 'bootstrap/scss/bootstrap.scss'; // it works too

import Root from './Root';

import '../styles/admin.scss';

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