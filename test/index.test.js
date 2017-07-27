'use strict';

const path      = require('path');

const reader    = require(path.resolve(__dirname, 'reader.js'));

const log       = console.log;

it('test', () => {

    const data = reader('test');

    data.tcss('url(/asset/app/style/img/import.jpg)', 3);

    // nothing to test in js
});