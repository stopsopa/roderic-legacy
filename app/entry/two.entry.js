'use strict';

const path          = require('path');

// var moment          = require('moment');
var join               = require('lodash/join');

function component () {

    var element = document.createElement('div');

    /* lodash is required for the next line to work */
    element.innerHTML = join(['Hello2', 'webpack2', 'included', 'and', 'works', '-', 'require', 'lodash'], ' - ');

    return element;
}

setTimeout(function () {
    document.body.appendChild(component());
}, 1000);




