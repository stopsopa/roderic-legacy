'use strict';

const fs = require('fs');

const sync      = require('./sync');

module.exports = function dirEnsure(dir, createIfNotExist) {

        if ( fs.existsSync(dir) ) {

            if ( ! fs.lstatSync(dir).isDirectory() ) {

                throw "'" + dir + "' is not directory";
            }
        }
        else {

            if (createIfNotExist) {

                try {

                    sync(dir);

                    if ( ! fs.existsSync(dir) ) {

                        throw "Directory '" + dir + "' doesn't exist, check after mkdirp.sync(" + dir + ")";
                    }
                }
                catch (e) {

                    throw "Can't create directory '" + dir + "', error: " + e;
                }
            }
            else {

                throw "Directory '" + dir + "' doesn't exist, (createIfNotExist = false) check";
            }
        }
    };



