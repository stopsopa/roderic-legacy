'use strict';

const path      = require('path');

const reader    = require(path.resolve(__dirname, 'reader.js'));

const log       = console.log;

it('bootstrap', () => {

    const data = reader('bootstrap'); // /dist/bootstrap.bundle.css

    data.tcss('url(/asset/example/img/webpack3.jpg)', 1);

    data.tcss('url(data:image/jpeg;base64,/9j/4AAQSkZJRgABA', 1);

    // log('css', data.css);

    data.tcss(`url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E");`, 1);

    data.tjs('bootstrap - i will search for this in tests', 1);
});