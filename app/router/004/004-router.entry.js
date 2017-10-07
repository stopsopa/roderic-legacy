
// https://reacttraining.com/react-router/web/guides/quick-start

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import log from '../../../react/webpack/logw';
import '../common/style.scss';

import { BrowserRouter as Router, Route, Link, Redirect, withRouter, Prompt } from 'react-router-dom';

const home = '/router/004';

const PreventingTransitionsExample = () => (
    <Router>
        <div>
            <ul>
                <li><Link to={home}>Form</Link></li>
                <li><Link to={`${home}/one`}>One</Link></li>
                <li><Link to={`${home}/two`}>Two</Link></li>
            </ul>
            <Route path={home} exact component={Form}/>
            <Route path={`${home}/one`} render={() => <h3>One</h3>}/>
            <Route path={`${home}/two`} render={() => <h3>Two</h3>}/>
            <a href="//www.google.co.uk/search?q=reacttraining.com+preventing+transitions">google search</a>
        </div>
    </Router>
)

class Form extends React.Component {
    state = {
        isBlocking: false
    }

    render() {
        const { isBlocking } = this.state

        return (
            <form
                onSubmit={event => {
                    event.preventDefault()
                    event.target.reset();
                    log('try');
                    this.setState({
                        isBlocking: false
                    })
                }}
            >
                <Prompt
                    when={isBlocking}
                    message={location => (
                        `Are you sure you want to go to ${location.pathname}`
                    )}
                />

                <p>
                    Blocking? {isBlocking ? 'Yes, click a link or the back button' : 'Nope'}
                </p>

                <p>
                    <input
                        size="50"
                        placeholder="type something to block transitions"
                        onChange={event => {
                            this.setState({
                                isBlocking: event.target.value.length > 0
                            })
                        }}
                    />
                </p>

                <p>
                    <button>Submit to stop blocking</button>
                </p>
            </form>
        )
    }
}

ReactDOM.render(
    <PreventingTransitionsExample />,
    document.getElementById('app')
);