
// https://reacttraining.com/react-router/web/guides/quick-start

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../common/style.scss';

import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';

const home = '/router/002';

// class One extends Component {
//     render() {
//         return (
//             <div>{this.props.data.toUpperCase()}</div>
//         );
//     }
// }

const Home = () => (
    <div>
        <h2>Home</h2>
    </div>
)

const About = () => (
    <div>
        <h2>About</h2>
    </div>
)

const Topic = ({ match }) => (
    <div>
        <h3>{match.params.topicId}</h3>
    </div>
)

const Topics = ({ match }) => (
    <div>
        <h2>Topics</h2>
        <ul>
            <li>
                <Link to={`${match.url}/rendering`}>
                    Rendering with React
                </Link>
            </li>
            <li>
                <Link to={`${match.url}/components`}>
                    Components
                </Link>
            </li>
            <li>
                <Link to={`${match.url}/props-v-state`}>
                    Props v. State
                </Link>
            </li>
        </ul>

        <Route path={`${match.url}/:topicId`} component={Topic}/>
        <Route exact path={match.url} render={() => (
            <h3>Please select a topic.</h3>
        )}/>
    </div>
);

class ScrollToTop extends Component { // https://reacttraining.com/react-router/web/guides/scroll-restoration
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0)
        }
    }

    render() {
        return this.props.children
    }
}

const WrappedScrollToTop = withRouter(ScrollToTop);

const BasicExample = () => (
    <Router>
        <WrappedScrollToTop>
            <div>
                <ul>
                    <li><Link to={`${home}`}>Home</Link></li>
                    <li><Link to={`${home}/about`}>About</Link></li>
                    <li><Link to={`${home}/topics`}>Topics</Link></li>
                </ul>

                <hr/>

                <Route exact path={`${home}`} component={Home}/>
                <Route path={`${home}/about`} component={About}/>
                <Route path={`${home}/topics`} component={Topics}/>
            </div>
        </WrappedScrollToTop>
    </Router>
);

ReactDOM.render(
    <BasicExample />,
    document.getElementById('app')
);
