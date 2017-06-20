'use strict';

const path              = require('path');

// var moment          = require('moment');
var join               = require('lodash/join');

// included in both
var size                = require('lodash/size');

// alias test
var log                 = require('log');

const arr = [7,45,6];

function component () {

    var element = document.createElement('div');

    /* lodash is required for the next line to work */
    element.innerHTML = join([
        'Hello2', 'webpack2', 'included', 'and', 'works', '-',
        'require', 'lodash', require('lib/lib'),
        require('lib/both'),
        size(arr)
    ], ' - ');

    return element;
}

setTimeout(function () {
    document.body.appendChild(component());
    log('log...');
}, 1000);




