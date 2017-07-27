'use strict';

const path      = require('path');

const reader    = require(path.resolve(__dirname, 'reader.js'));

const log       = console.log;

it('index-dir', () => {

    const data = reader('index-dir');

    data.tcss('url(/asset/app/styledir/img/webpack.jpg)', 1);

    data.tjs('"use strict"', 1);
});