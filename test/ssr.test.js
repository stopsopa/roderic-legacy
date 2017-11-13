
import 'isomorphic-fetch';

import path from 'path';

const config = require(path.resolve(__dirname, '..', process.env.WEBPACK_REACTDIR || 'react', 'config'));

const ip    = config.server.host;

const port  = config.server.port;

let p = '';

if (port != 80) {

    p = `:${port}`;
}

const request = path => fetch(`http://${ip}${p}${path}`);

it('ssr router', () => request('/gui')
    .then(res => res.text())
    .then(html => {
        expect(html).toContain('<a href="http://domain-d.com" target="_blank">http://domain-d.com</a>');
        expect(html).toContain(`":"http:\\u002F\\u002Fdomain-d.com","`);
    }))

it('ssr nested component', () => request('/gui/edit/58f762a2cbb458229c0974f8')
    .then(res => res.text())
    .then(html => expect(html).toContain('other then router component')))