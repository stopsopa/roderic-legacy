'use strict';

const log = require('log');

// this works
// require('../../node_modules/bootstrap/dist/css/bootstrap.css');
// require('../../node_modules/bootstrap/dist/css/bootstrap-theme.css');



// this works too, it's better to use this paths

// require('bootstrap/dist/css/bootstrap.css'); // it works

import 'bootstrap/dist/css/bootstrap.css'; // it works
// import 'bootstrap/scss/bootstrap.scss'; // it works

// for bootstrap 3
    // require('bootstrap/dist/css/bootstrap-theme.css');

// loading from local linked directory - so cool :)
require('example/index.css');


log('test autoloade (provide) log library');
log('bootstrap - i will search for this in tests')



