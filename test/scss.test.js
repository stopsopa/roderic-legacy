'use strict';

const path      = require('path');

const reader    = require(path.resolve(__dirname, 'reader.js'));

const log       = console.log;

it('scss', () => {

    const data = reader('scss');

    data.tcss('url(/asset/app/scss/scss/img/sass.png)', 1);

    data.tcss('url(/asset/app/scss/inc/jpg/all.jpg)', 1);

    data.tjs('scss - i will search for this in tests', 1);
});