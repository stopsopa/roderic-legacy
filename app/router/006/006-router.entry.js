
// https://reacttraining.com/react-router/web/guides/quick-start

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import log from '../../../react/webpack/logw';
import '../common/style.scss';

import { BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter, Prompt } from 'react-router-dom';

const home = location.pathname;

const PEEPS = [
    { id: 0, name: 'Michelle', friends: [ 1, 2, 3 ] },
    { id: 1, name: 'Sean', friends: [ 0, 3 ] },
    { id: 2, name: 'Kim', friends: [ 0, 1, 3 ], },
    { id: 3, name: 'David', friends: [ 1, 2 ] }
];

const find = (id) => PEEPS.find(p => p.id == id);

const RecursiveExample = () => (
    <Router>
        <Person match={{ params: { id: 0 }, url: home }} />
    </Router>
)

const Person = ({ match }) => {

    log(match);

    const person = find(match.params.id);

    return (
        <div className="gray">
            <h3>{person.name}’s Friends</h3>
            <ul>
                {person.friends.map(id => (
                    <li key={id}>
                        <Link to={`${match.url}/${id}`}>
                            {find(id).name}
                        </Link>
                    </li>
                ))}
            </ul>
            <Route path={`${match.url}/:id`} component={Person} />
        </div>
    )
}

ReactDOM.render(
    <RecursiveExample />,
    document.getElementById('app')
);