
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './001-style.scss';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

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
                {animals.map((path) => <div key={path}>
                    <Link to={`/animal/${path}`}>
                        {path}
                    </Link>
                </div>)}
                <Route path="/animal/:path" component={Props} />
            </div>
            <div className="right">
                {numbers.map((num) => <div key={num}>
                    <Link to={`/number/${num}`}>
                        {num}
                    </Link>
                </div>)}
                <Route path="/number/:num" component={Props} />
            </div>
        </div>
    </Router>,
    document.getElementById('app')
);
