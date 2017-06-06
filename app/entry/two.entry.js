'use strict';

const path          = require('path');

var moment          = require('moment');
var _               = require('lodash');

function component () {

    var element = document.createElement('div');

    /* lodash is required for the next line to work */
    element.innerHTML = _.join(['Hello2', 'webpack2', 'included', 'and', 'works', '-', 'require', 'lodash'], ' - ');

    return element;
}

document.body.appendChild(component());




