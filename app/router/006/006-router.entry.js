
// https://reacttraining.com/react-router/web/guides/quick-start

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import isNumber from 'lodash/isNumber';
import log from '../../../react/webpack/logw';
import '../common/style.scss';

import { BrowserRouter as Router, Route, Link, NavLink, Switch, Redirect, withRouter, Prompt } from 'react-router-dom';

const home = '/router/006';

const PEEPS = [
    { id: 0, name: 'Michelle', friends: [ 1, 2, 3 ] },
    { id: 1, name: 'Sean', friends: [ 0, 3 ] },
    { id: 2, name: 'Kim', friends: [ 0, 1, 3 ], },
    { id: 3, name: 'David', friends: [ 1, 2 ] }
];

const find = (id) => PEEPS.find(p => p.id == id);

const RecursiveExample = () => (
    <Router>
        <div>

            <Link to={home}>home</Link>
            <span style={{marginRight: '10px'}} />
            <Link to={`${home}/3/1/0/1/0/2/1/0/2/3/1`}>/router/006/3/1/0/1/0/2/1/0/2/3/1</Link>

            { /index/.test(location.href) &&
                <Redirect exact from={`${home}/index.html`} to={home} />
            }
            <Person match={{ params: { id: 0 }, url: home }} />
        </div>
    </Router>
)

const Person = ({ match }) => {

    log('match', match);

    const person = find(match.params.id);

    log('person', person);

    if ( ! person ) {

        return <div>id '{match.params.id}' don't match to any person</div>
    }

    return (
        <div className="gray">
            <h3>{person.name}’s Friends</h3>
            <ul>
                {person.friends.map(id => (
                    <li key={id}>
                        <NavLink
                            to={`${match.url}/${id}`}
                            activeClassName="active"
                        >
                            {find(id).name}
                        </NavLink>
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