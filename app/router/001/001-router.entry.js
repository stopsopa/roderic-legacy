
// https://reacttraining.com/react-router/web/guides/philosophy

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../common/style.scss';

import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';

const home = '/router/001';

// class One extends Component {
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

class ScrollToTop extends Component { // https://reacttraining.com/react-router/web/guides/scroll-restoration
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {

// all function found https://stackoverflow.com/a/26798337/5560682

            // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
            // WARNING: better polyfill: https://gist.github.com/paulirish/1579671
            window.requestAnimFrame = (function(){
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function( callback ) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();

            // main function
            function scrollToY(scrollTargetY, speed, easing) {
                // scrollTargetY: the target scrollY property of the window
                // speed: time in pixels per second
                // easing: easing equation to use

                var scrollY = window.scrollY,
                    scrollTargetY = scrollTargetY || 0,
                    speed = speed || 2000,
                    easing = easing || 'easeOutSine',
                    currentTime = 0;

                // min time .1, max time .8 seconds
                var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

                // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
                var PI_D2 = Math.PI / 2,
                    easingEquations = {
                        easeOutSine: function (pos) {
                            return Math.sin(pos * (Math.PI / 2));
                        },
                        easeInOutSine: function (pos) {
                            return (-0.5 * (Math.cos(Math.PI * pos) - 1));
                        },
                        easeInOutQuint: function (pos) {
                            if ((pos /= 0.5) < 1) {
                                return 0.5 * Math.pow(pos, 5);
                            }
                            return 0.5 * (Math.pow((pos - 2), 5) + 2);
                        }
                    };

                // add animation loop
                function tick() {
                    currentTime += 1 / 60;

                    var p = currentTime / time;
                    var t = easingEquations[easing](p);

                    if (p < 1) {
                        requestAnimFrame(tick);

                        window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
                    } else {
                        console.log('scroll done');
                        window.scrollTo(0, scrollTargetY);
                    }
                }

                // call it once to get started
                tick();
            }

            // scroll it!
            scrollToY(0, 1500, 'easeInOutQuint');
        }
    }

    render() {
        return this.props.children
    }
}

const WrappedScrollToTop = withRouter(ScrollToTop);

var animals = 'horse cat dog swan monkey'.split(/\s/g)
var numbers = 'one two three four six'.split(/\s/g);

ReactDOM.render(
    <Router>
        <WrappedScrollToTop>
            <div id="grid">

                <div className="left">
                    {animals.map((path) => (
                        <div key={path}>
                            <Link to={`${home}/animal/${path}`}>
                                {path}
                            </Link>
                        </div>
                    ))}
                    <Route path={`${home}/animal/:path`} component={Props} />
                </div>

                <div className="right">
                    <Link to={home}>{home}</Link> <br/>
                    <Link to={`${home}/router`}>/router</Link>
                    {numbers.map((num) => (
                        <div key={num}>
                            <Link to={`${home}/router/${num}`}>
                                {num}
                            </Link>
                        </div>
                    ))}
                    <Route exact path={`${home}/router`} render={(props) => (
                        <h4>Hello router - exact</h4>
                    )} />
                    <Route path={`${home}/router`} render={(props) => (
                        <h4>Hello router - not exact</h4>
                    )} />
                    <Route path={`${home}/router/:num`} render={({ match, ...props }) => (<pre>
                        param: {match.params.num}
                        {"\n"}
                        this.props: {JSON.stringify(Object.assign(props, {match: match}), null, '    ')}
                    </pre>)} />
                </div>

            </div>
        </WrappedScrollToTop>
    </Router>,
    document.getElementById('app')
);
