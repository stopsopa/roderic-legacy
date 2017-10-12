
import 'isomorphic-fetch';

import config from '../react/config';

const ip    = config.server.host;

const port  = config.server.port;

let p = '';

if (port != 80) {

    p = `:${port}`;
}

const request = path => fetch(`http://${ip}${p}${path}`);

it('ssr', () => request('/gui')
    .then(res => res.text())
    .then(html => expect(html).toContain('<a href="http://domain-d.com" target="_blank" data-reactid="')))