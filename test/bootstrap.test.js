'use strict';

const path      = require('path');

const reader    = require(path.resolve(__dirname, 'reader.js'));

const log       = console.log;

it('bootstrap', () => {

    const data = reader('bootstrap');

    data.tcss('url(/asset/example/img/webpack3.jpg)', 1);

    data.tcss('url(data:image/jpeg;base64,/9j/4AAQSkZJRgABA', 1);

    data.tcss('url(/asset/public/bootstrap/dist/fonts/glyphicons-halflings-regular.eot)', 1);

    data.tjs('bootstrap - i will search for this in tests', 1);
});