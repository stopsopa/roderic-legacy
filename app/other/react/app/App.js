'use strict';

import React from 'react';
// import ajax from 'lib/ajax';
import Icheckbox from './Icheckbox';
import { autobind } from 'core-decorators';

import './App.scss';

export default class App extends React.Component {
    constructor(...args) {
        super(...args);

        this.state = {
            _loading: true,
            _error: false
            // _errors: {} // should be empty now
        }
    }
    componentDidMount() {

        this.transport();
    }
    transport = (fetchParams = {}) => {

        this.repeat = () => {

            this.setState({
                _loading: true,
                _error: false
            });

            fetch(this.props.url, fetchParams)
                .then(response => response.json())
                .then(json => this.setState({
                    ...this.state,
                    ...json.data,
                    ...{_loading: false}
                }), () => this.setState({
                    _loading: false,
                    _error: true
                }))
            ;
        }

        this.repeat();
    }
    onChangeWithoutCheckbox = (e) => {
        this.setState((prevState, props) => ({
            withoutcheckbox: !prevState.withoutcheckbox
        }));
    }
    onChangeMultiple = (e) => {
        let options = e.target.options;
        let value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        this.setState({
            multiple: value
        });
    }
    onSubmit = (e) => {

        e.preventDefault();

        this.transport({
            method: "POST",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(this.state)
        });
    }
    removeFromList = (i) => {
        return () => {
            let tmp = [...this.state.list];
            tmp.splice(i, 1);
            this.setState({list: tmp});
        }
    }
    setToIndex = (i, key, integer) => {
        return e => {
            let list = [...this.state.list];
            let item = {...list[i]};
            item[key] = e.target.value;
            if (integer) {
                item[key] = parseInt(item[key], 10);
            }
            list[i] = item;
            this.setState({ list });
        }
    }
    render() {

        if (this.state._error) {

            return <div>Server error occurred... {this.repeat && <button onClick={this.repeat}>Retry...</button>}</div>
        }

        if (this.state._loading && ! this.state._errors ) {

            return <div>loading...</div>
        }

        return (
            <form onSubmit={this.onSubmit}>
                <h3>Simple form</h3>
                <div>
                    <label>
                        e-mail: <br/>
                        <input type="text" value={this.state.email} onChange={e => this.setState({email: e.target.value})} />
                    </label>
                    {this.state._errors['email'] && <div className="error">{this.state._errors['email']}</div>}
                </div>
                <div>
                    <label>
                        title: <br/>
                        <input type="text" value={this.state.input} onChange={e => this.setState({input: e.target.value})} />
                    </label>
                    {this.state._errors['input'] && <div className="error">{this.state._errors['input']}</div>}
                </div>
                <div>
                    <label htmlFor="description">
                        description: <br/>
                        <textarea name="description" value={this.state.description} onChange={e => this.setState({description: e.target.value})}></textarea>
                    </label>
                    {this.state._errors['description'] && <div className="error">{this.state._errors['description']}</div>}
                </div>
                <div className="grid">
                    <div className="inputs">
                        <label>
                            <input type="radio" id="male" value="male"
                                   checked={this.state.radio === 'male'} onChange={e => this.setState({radio: e.target.value})}
                            /> male
                        </label>
                        <label htmlFor="female">
                            <input type="radio" name="radio" id="female" value="female"
                                   checked={this.state.radio === 'female'} onChange={e => this.setState({radio: e.target.value})}
                            /> female
                        </label>

                    </div>
                    <div className="icon">
                        <img className="gender" src={'/asset/rassets/img/'+this.state.radio+'.bmp'}/>
                    </div>
                </div>
                <div>
                    <label>

                        <input type="checkbox"
                               checked={this.state.checkbox}
                               onChange={e => this.setState({checkbox: e.target.checked})} /> checkbox raw
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
                               onChange={e => this.setState({checkbox: e.target.checked})}
                        />
                        <span className="fake"></span>
                        checked css
                    </label>
                </div>
                <div>
                    <Icheckbox
                        label="checkbox component"
                        onChange={e => this.setState({checkboxcomponent: e.target.checked})}
                        checked={this.state.checkboxcomponent}
                        data-test="anoter attribute"
                    />
                </div>
                <div className="single">
                    <select value={this.state.single} name="single" onChange={e => this.setState({single: e.target.value || null})}>{/* https://facebook.github.io/react/docs/forms.html#why-select-value */}
                        <option value="">-=select=-</option>
                        <option value="apple">Apple</option>
                        <option value="banana">Banana</option>
                        <option value="cranberry">Cranberry</option>
                    </select>
                    { (this.state.single === 'apple') && <img src={'/asset/rassets/img/apple.bmp'}/> }
                    {this.state._errors['single'] && <div className="error">{this.state._errors['single']}</div>}
                    <div className="clear"></div>
                </div>
                <div className="relative">
                    <label htmlFor="multiple">
                        <select value={this.state.multiple} name="multiple" multiple={true} onChange={this.onChangeMultiple}>{/* https://facebook.github.io/react/docs/forms.html#why-select-value */}
                            <option value="apple">Apple</option>
                            <option value="banana">Banana</option>
                            <option value="cranberry">Cranberry</option>
                        </select> multiple
                    </label>
                    <div className="multiple">
                        {this.state.multiple.map(function (i) {
                            return <img key={i} src={'/asset/rassets/img/' + i + '.bmp'} />
                        })}
                    </div>
                    {this.state._errors['multiple'] && <div className="error">{this.state._errors['multiple']}</div>}
                </div>
                <div>
                    <hr/>
                    <button onClick={() => this.setState({list: [...this.state.list, {}]})}>add</button>
                    {this.state.list.map((e, i) =>
                        <table key={i}>
                            <tbody>
                                <tr>
                                    <td>
                                        <label>
                                            title {i}
                                            <input type="text" value={e.title} onChange={this.setToIndex(i, 'title')}/>
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            num {i}
                                            <input type="number" value={e.num} onChange={this.setToIndex(i, 'num', true)} />
                                        </label>
                                    </td>
                                    <td>
                                        <button onClick={this.removeFromList(i)}>del</button>
                                    </td>
                                    <td>
                                        {this.state._errors[`list.${i}.num`] && <div className="error">{this.state._errors[`list.${i}.num`]}</div>}
                                        {this.state._errors[`list.${i}.title`] && <div className="error">{this.state._errors[`list.${i}.title`]}</div>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                    {this.state._errors['list'] && <div className="error">{this.state._errors['list']}</div>}
                    <hr/>
                </div>

                { (Object.keys(this.state._errors).length > 0) && <div className="error">There are some errors in the form, please fix it and submit form again</div>}

                <div data-test="react - i will search for this in tests">
                    {this.props.github ?
                        <input type="submit"
                               value="No php - can't save"
                               disabled={true}
                        /> :
                        <input type="submit"
                               value={this.state._loading ? 'Saving...' : 'Submit'}
                               disabled={this.state._loading}
                        />
                    }
                </div>
            </form>
        );
    }
}


