'use strict';

const https     = require('https');
const path      = require('path');
const fs        = require('fs');
const Stream    = require('stream').Transform;
const dirEnsure = require('./dirEnsure');
const error     = require('./error');

module.exports = (source, target) => {

    return new Promise((resolve, reject) => {

        const url = `${source}?${new Date()*1}`;

        https.get(url, function (response) {

            if (response.statusCode === 200) {

                if ( target ) {

                    dirEnsure(path.dirname(target), true);

                    const file = fs.createWriteStream(target);

                    return response
                        .on('data', data => file.write(data))
                        .on('end', () => {
                            file.end();
                            resolve();
                        })
                        .on('error', error);
                }
                else {

                    const data = new Stream();

                    return response
                        .on('data', chunk => data.push(chunk))
                        .on('end', () => {

                            const json = JSON.parse(data.read());

                            if (json) {

                                return resolve(json)
                            }

                            error(`Couldn't decode json: ${source}`);
                        })
                        .on('error', error);
                }
            }

            error(`Downloading '${url}' failed,\nhttp status code: ${response.statusCode}`);
        });
    });
};