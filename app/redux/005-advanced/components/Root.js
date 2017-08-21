
import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
// https://reacttraining.com/react-router/  2:20
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';

const Root = ({ store }) => (
    <Provider store={store}>
        <Router>
            <Route path="/redux/005-advanced/app.html" component={App} />
        </Router>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired
};

export default Root;