'use strict';

module.exports = function trim(s) {
    return (s || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/,'$1');
}