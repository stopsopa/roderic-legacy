'use strict';

import React from 'react';
// import ajax from 'lib/ajax';
import Icheckbox from './Icheckbox';
import { autobind } from 'core-decorators';

export default class App extends React.Component {
    constructor(...args) {
        super(...args);

        this.state = {
            input: '',
            description: 'default',
            radio: 'female',
            checkbox: false,
            checkboxcomponent: false,
            withoutcheckbox: false,
            single: '',
            multiple: [],
            save: true
        }
    }
    componentDidMount() {
        fetch(this.props.url, {
            method: "POST",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({})
        }).then((r) => r.json()).then((json) => {
            setTimeout(() => {
                log('json', json)
                this.setState(Object.assign(this.state, json, {save: false}));
            }, 1000);
        });
    }
    @autobind
    onChangeInput(e) {
        this.setState({input: e.target.value});
    }
    @autobind
    onChangeDescription(e) {
        this.setState({description: e.target.value});
    }
    @autobind
    onChangeCheckbox(e) {
        log('onChangeCheckbox')
        this.setState({checkbox: e.target.checked});
    }
    @autobind
    onChangeWithoutCheckbox(e) {
        log('onChangeWithoutCheckbox')
        this.setState((prevState, props) => ({
            withoutcheckbox: !prevState.withoutcheckbox
        }));
    }
    // @autobind
    onChangeComponent(e) {
        log('onChangeComponent not bound')
        this.setState({checkboxcomponent: e.target.checked});
    }
    @autobind
    onChangeRadio(e) {
        this.setState({radio: e.target.value});
    }
    @autobind
    onChangeSingle(e) {
        this.setState({
            single: e.target.value || null
        });
    }
    @autobind
    onChangeMultiple(e) {
        var options = e.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        this.setState({
            multiple: value
        });
    }
    @autobind
    onSubmit(e) {
        e.preventDefault();
        var that = this;

        setTimeout(function () {
            that.setState({
                save: true
            });
        }, 0);

        fetch(this.props.url, {
            method: "POST",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(this.state)
        }).then((r) => r.json()).then((json) => {
            setTimeout(() => {
                log('json', json)
                this.setState(json)
            }, 1000);
        });
    }
    // shouldComponentUpdate() {
        // https://github.com/seansfkelley/pure-render-decorator/commit/137f8a3c6999aba4688f81ad6c9f4b9f0a180de1
    // }
    // @autobind
    render() {

        log('render', this.state);

        return (
            <form onSubmit={this.onSubmit}>
                <h3>Simple form</h3>
                <div>
                    <label htmlFor="input">
                        <input type="text" name="input" value={this.state.input} onChange={this.onChangeInput} />
                    </label>
                </div>
                <div>
                    <label htmlFor="description">
                        <textarea name="description" value={this.state.description} onChange={this.onChangeDescription}></textarea>
                    </label>
                </div>
                <div className="relative">
                    <label htmlFor="male">
                        <input type="radio" name="radio" id="male" value="male"
                               checked={this.state.radio === 'male'} onChange={this.onChangeRadio}
                        /> male
                    </label>

                    <img className="gender" src={'/research/004-es6/app/react/img/'+this.state.radio+'.bmp'}/>
                </div>
                <div>
                    <label htmlFor="female">
                        <input type="radio" name="radio" id="female" value="female"
                               checked={this.state.radio === 'female'} onChange={this.onChangeRadio}
                        /> female
                    </label>
                </div>
                <div>
                    <label>

                        <input type="checkbox"
                               checked={this.state.checkbox}
                               onChange={this.onChangeCheckbox} /> checkbox raw
                    </label>
                </div>
                <div>
                    <label>
                        <span style={{border: '1px gray solid'}}
                            onClick={this.onChangeWithoutCheckbox}
                        >{this.state.withoutcheckbox ? 'On' : 'Off'}</span> without checkbox
                    </label>
                </div>
                <div>
                    <label className="icontrol">
                        <input type="checkbox"
                               checked={this.state.checkbox}
                               onChange={this.onChangeCheckbox}
                        />
                        <span className="fake"></span>
                        checked css
                    </label>
                </div>
                <div>
                    <Icheckbox
                        label="checkbox component"
                        onChange={(e) => this.onChangeComponent(e)}
                        checked={this.state.checkboxcomponent}
                        data-test="anoter attribute"
                    />
                </div>
                <div className="relative">
                    <label htmlFor="single">
                        <select value={this.state.single} name="single" onChange={this.onChangeSingle}>{/* https://facebook.github.io/react/docs/forms.html#why-select-value */}
                            <option>-=select=-</option>
                            <option value="apple">Apple</option>
                            <option value="banana">banana</option>
                            <option value="cranberry">cranberry</option>
                        </select> single
                    </label>
                    <div className="single">
                        { (this.state.single === 'apple') && <img src={'/research/004-es6/app/react/img/apple.bmp'}/> }
                    </div>
                </div>
                <div className="relative">
                    <label htmlFor="multiple">
                        <select value={this.state.multiple} name="multiple" multiple={true} onChange={this.onChangeMultiple}>{/* https://facebook.github.io/react/docs/forms.html#why-select-value */}
                            <option value="apple">Apple</option>
                            <option value="banana">banana</option>
                            <option value="cranberry">cranberry</option>
                        </select> multiple
                    </label>
                    <div className="multiple">
                        {this.state.multiple.map(function (i) {
                            return <img key={i} src={'/research/004-es6/app/react/img/' + i + '.bmp'} />
                        })}
                    </div>
                </div>
                <div>
                    <input type="submit"
                           value={this.state.save ? 'Saving...' : 'Submit'}
                           disabled={this.state.save}
                    />
                </div>
            </form>
        );
    }
}


