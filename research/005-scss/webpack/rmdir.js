'use strict';

const path  = require('path');
const fs    = require('fs');

const log = (function () {
    return function () {}
    try {
        return console.log;
    }
    catch (e) {
        return function () {}
    }
}());

module.exports = function rmdir(dirPath, removeSelf) {

    log('rmdir', dirPath);

    (typeof removeSelf === 'undefined') && (removeSelf = false)

    try {

        var files = fs.readdirSync(dirPath);
    }
    catch(e) {
        return;
    }

    if (files.length > 0) {

        for (var i = 0, l = files.length; i < l; i++) {

            var filePath = path.join(dirPath, files[i]);

            if (fs.statSync(filePath).isFile()) {

                log('removing', filePath);

                fs.unlinkSync(filePath);
            }
            else {

                rmdir(filePath);
            }
        }
    }

    if (removeSelf) {

        fs.rmdirSync(dirPath);
    }
};