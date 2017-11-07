/**
 * @author Szymon Działowski
 * @license MIT License (c) copyright 2017-present original author or authors
 * @homepage https://github.com/stopsopa/roderic
 */

'use strict';

const log = (function () {
    try {
        if (console.log) {
            return function () {
                console.log.apply(this, Array.prototype.slice.call(arguments));
                return log;
            }
        }
    }
    catch (e) {
        return function () {return log};
    }
}());

log.stack = function () {return log};

module.exports = log.dump = log.json = log.log = log;