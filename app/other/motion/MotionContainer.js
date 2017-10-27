
import React, { Component } from 'react';

import { Motion, TransitionMotion, spring } from 'react-motion';

import range from 'lodash/range';

import './MotionContainer.scss';

const log = console.log;

const provider = (function () {
    let num = 4;
    const list = fn => range(1, num + 1).map(fn);
    return {
        down() {
            num = (num > 1) ? num - 1 : 1;
            return this.render();
        },
        up() {
            num += 1;
            return this.render();
        },
        render() { // for data
            return list(i => ({
                key: String.fromCharCode(96 + i),
                size: i * 10
            }));
            // return [{key: 'a', size: 10}, {key: 'b', size: 20}, {key: 'c', size: 30}]
        }
    }
}());

export default class MotionContainer extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            first: true,
            firstRender: true,
            items: provider.render(),
        };
    }
    list = method => this.setState({
        items: provider[method]()
    })
    toggle = key => this.setState({
        [key] : !this.state[key]
    })
    willLeave = () => ({x:spring(0)})
    render = () => {
        return (
            <div>
                <div>
                    <div>Motion:</div>
                    {this.state.firstRender &&
                        <Motion
                            defaultStyle={{x: 0}}
                            style={{x: spring(this.state.first ? 300 : 0)}}
                            // there is no willLeave for Motion itself
                            // check workaround with TransitionMotion
                            // https://codepen.io/anon/pen/wzdBoa?editors=0010#0
                            // my mod: https://codepen.io/stopsopa/pen/VrZzgj?editors=0010
                            // mentioned in: https://github.com/chenglou/react-motion/issues/311#issuecomment-249489992
                            // willLeave={this.willLeave}
                        >
                            {({x}) => <div
                                className="first"
                                style={{
                                    width: `${x}px`
                                }}
                            >{x}</div>}
                        </Motion>
                    }
                    <button onClick={() => this.toggle('first')}>toggle</button>
                    <button onClick={() => this.toggle('firstRender')}>hide</button>
                </div>
                <hr/>
                <div>
                    <div>TransitionMotion:</div>
                    <button onClick={() => this.list('up')}>up</button>
                    <button onClick={() => this.list('down')}>down</button>
                    <br/>
                    <TransitionMotion
                        styles={this.state.items.map(({key, size}) => ({ // required
                            key,
                            style: {w: spring(size), h: spring(size)},
                        }))} // target size
                        defaultStyles={this.state.items.map(({key}) => ({ // optional
                            key,
                            style: {w:0,h:0}
                        }))} // when you first render element on initial list
                        // wait util this values reach this values and then remove element from DOM
                        willLeave={() => ({w: spring(0), h: spring(0)})}
                        willEnter={() => ({w: 0, h: 0})} // when dynamically render new element
                    >
                        {interpolatedStyles =>
                            <div> {/* try later to remove this div in react 16 */}
                                {interpolatedStyles.map(({style, key}) => (
                                    <div
                                        key={key}
                                        style={{
                                            width: `${style.w}px`,
                                            height: `${style.h}px`,
                                            border: '1px solid'
                                        }}
                                    />
                                ))}
                            </div>
                        }
                    </TransitionMotion>
                </div>
            </div>
        );
    }
}