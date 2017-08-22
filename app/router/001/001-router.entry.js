
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './001-style.scss';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const home = '/router/001/index.html';

// class One extends Component {
//     static PropTypes = {
//         data: PropTypes.string.isRequired
//     }
//     render() {
//         return (
//             <div>{this.props.data.toUpperCase()}</div>
//         );
//     }
// }

class Props extends Component {
    render() {
        return (
            <pre>
                this.props: {JSON.stringify(this.props, null, '    ')}
            </pre>
        );
    }
}

var animals = 'horse cat dog swan monkey'.split(/\s/g)
var numbers = 'one two three four six'.split(/\s/g);

ReactDOM.render(
    <Router>
        <div id="grid">

            <div className="left">
                {animals.map((path) => (
                    <div key={path}>
                        <Link to={`/animal/${path}`}>
                            {path}
                        </Link>
                    </div>
                ))}
                <Route path="/animal/:path" component={Props} />
            </div>

            <div className="right">
                <Link to={home}>{home}</Link> <br/>
                <Link to="/router">/router</Link>
                {numbers.map((num) => (
                    <div key={num}>
                        <Link to={`/router/${num}`}>
                            {num}
                        </Link>
                    </div>
                ))}
                <Route exact={true} path="/router" render={(props) => (
                    <h4>Hello router - exact</h4>
                )} />
                <Route path="/router" render={(props) => (
                    <h4>Hello router - not exact</h4>
                )} />
                <Route path="/router/:num" render={({ match, ...props }) => (<pre>
                    param: {match.params.num}
                    {"\n"}
                    this.props: {JSON.stringify(Object.assign(props, {match: match}), null, '    ')}
                </pre>)} />
            </div>

        </div>
    </Router>,
    document.getElementById('app')
);
