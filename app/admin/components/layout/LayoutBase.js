
import React, { Component } from 'react';

class LayoutBase extends Component {
    render() {
        return [
            <header key="header">Know AML</header>,
            <div key="div">
                <nav>
                    <button>add</button>
                    <div>
                        <p>Lorem ipsum</p>
                        <p>dolor</p>
                        <p>amet</p>
                        <p>bla bla</p>
                    </div>
                    <toggle></toggle>
                </nav>
                <main>
                    {this.props.children}
                </main>
                <aside>
                    <button>add</button>
                    <div>
                        <p>Lorem ipsum</p>
                        <p>dolor</p>
                        <p>amet</p>
                        <p>bla bla</p>
                    </div>
                    <toggle></toggle>
                </aside>
            </div>,
            <footer key="footer">Know AML - Admin area</footer>
        ];
    }
}

export default LayoutBase;