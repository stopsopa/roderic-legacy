'use strict';

const path      = require('path');

const reader    = require(path.resolve(__dirname, 'reader.js'));

const log       = console.log;

it('react', () => {

    const data = reader('react');

    data.tcss('url(/asset/app/react/style/img/redux.jpg)', 1);

    data.tcss('url(/asset/app/react/style/img/react.jpg)', 1);

    data.tjs('react - i will search for this in tests', 1);
});