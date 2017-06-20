'use strict';

require('style/index.css');

// included in both
var size                = require('lodash/size');

const arr = [7,45,6];

function component () {
    var element = document.createElement('div');

    /* lodash is required for the next line to work */
    element.innerHTML = [
        'Hello2', 'webpack2', 'included', 'and', 'works', '-', 'just', 'array.join',
        require('lib/both'),
        size(arr)
    ].join(' - ')

    return element;
}

setTimeout(function () {
    document.body.appendChild(component());
    document.querySelector('div').innerHTML = require('style/comment.svg');
}, 1000);




