'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

/**
 * https://facebook.github.io/react/docs/react-without-es6.html
 */
var Sandbox = React.createClass({
    propTypes: {
        leave: React.PropTypes.bool,
        appearTimeout: React.PropTypes.number
    },
    getInitialState: function() {
        return {count: this.props.initialCount};
    },
    onChange: function () {
        this.setState(function(prevState, props) {
            input: !prevState.input
        });
    },
    render: function () {
        return (
            <form onSubmit={this.onSubmit}>
                <label>
                    <input type="text" value={this.state.input} onChange={this.onChange} />
                </label>

                {this.state.multiple.map(function (i) {
                    return <img key={i} src={'/bundles/img/' + i + '.bmp'} />
                })}

                {Object.keys(this.state.list).map((i) => {
                    var item = this.state.list[i];
                    return <div key={i}>{item.name}</div>
                })}
            </form>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('app'));
