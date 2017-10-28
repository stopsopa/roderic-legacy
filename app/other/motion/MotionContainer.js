
import React, { Component } from 'react';

import { Motion, TransitionMotion, spring, presets } from 'react-motion';

import range from 'lodash/range';

import './MotionContainer.scss';

const log = console.log;

export default class MotionContainer extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            firstCounter: 4,
            first: true,
            firstRender: true,
            preset: (() => {
                return Object.keys(presets)[0]
            })()
        };
    }
    // Motion
    toggle = key => this.setState({
        [key] : !this.state[key]
    })

    // TransitionMotion
    more = () => this.setState({
        firstCounter: this.state.firstCounter + 1
    })
    less = () => this.setState({
        firstCounter: (this.state.firstCounter > 1) ? this.state.firstCounter - 1 : 1
    })
    getList = () => range(1, this.state.firstCounter + 1).map(i => ({
        key: String.fromCharCode(96 + i),
        size: i * 10
    }))
    render = () => {

        // Motion
        const motion = (
            <div>
                <div>Motion:</div>
                <button onClick={() => this.toggle('first')}>toggle</button>
                <button onClick={() => this.toggle('firstRender')}>hide</button>
                <br/>
                {this.state.firstRender &&
                <Motion
                    defaultStyle={{x: this.state.first ? 0 : 1000}}
                    style={{x: spring(this.state.first ? 1000 : 0, presets[this.state.preset])}}
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
            </div>
        );


        // TransitionMotion
        const transitionList = this.getList();

        const transition = (
            <div>
                <div>TransitionMotion:</div>
                <button onClick={this.more}>more</button>
                <button onClick={this.less}>less</button>
                <br/>
                <TransitionMotion
                    styles={transitionList.map(({key, size}) => ({ // required
                        key,
                        style: {w: spring(size, presets[this.state.preset]), h: spring(size, presets[this.state.preset])},
                    }))} // target size
                    defaultStyles={transitionList.map(({key}) => ({ // optional
                        key,
                        style: {w:0,h:0}
                    }))} // when you first render element on initial list
                    // wait util this values reach this values and then remove element from DOM
                    willLeave={() => ({w: spring(0, presets[this.state.preset]), h: spring(0, presets[this.state.preset])})}
                    willEnter={() => ({w: 0, h: 0})} // when dynamically render new element
                >
                    {interpolatedStyles =>
                        <div className="transition"> {/* try later to remove this div in react 16 */}
                            {interpolatedStyles.map(({style, key}) => (
                                <div
                                    key={key}
                                    style={{
                                        width: `${style.w}px`,
                                        height: `${style.h}px`,
                                        border: '1px solid',
                                        textAlign: 'center',
                                        fontSize: `${Math.ceil(style.h / 4) * 3}px`
                                    }}
                                >{key}</div>
                            ))}
                        </div>
                    }
                </TransitionMotion>
            </div>
        );

        const presetsDiv = (
            <div>
                {Object.keys(presets).map(key => (
                    <label key={key} className={key}>
                        <input
                            type="radio"
                            name="preset"
                            checked={this.state.preset === key}
                            onChange={() => this.setState({
                                preset: key
                            })}
                        />
                        {key}
                    </label>
                ))}
                {` > > ${this.state.preset}`}
            </div>
        );

        return (
            <div>
                {presetsDiv}
                <hr/>
                {motion}
                <hr/>
                {transition}
            </div>
        );
    }
}