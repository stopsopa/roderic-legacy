'use strict';

const parallel  = require('./parallel');
const prompt    = require('./prompt');
const trim      = require('./trim');

let argsCache;
let asklist = {}; // found in data

const defined = { // collected from data, ready to ask
    // finalkey: finalvalue
    // app_dir: 'app'
};

/**
 * :defval::key: - where in place of defval can be empty string
 */
module.exports = function (args) {

    argsCache = (args = args || argsCache);

    const regexp = /:([a-z0-9\._-]*)::([a-z0-9\._-]+):/ig;

    // var test = `one :defval1::key: two :defval2::key2: three :defval3::key3: end`;


    const descriptions = {
        react_dir   : "Webpack directory: ",
        web_dir     : "Publicly available server directory: ",
        app_dir     : "Application directory (directory with your React components): ",
        root        : "Root directory of project (main directory to resolve any paths)",
        app_name    : "Name of this project",
        jwtsecret   : "JWT secret"
    };

    Object.assign(defined, args);

    /**
     * Return array of found unique keys in text with its default values
     * @param input - string
     * @returns Array
     */
    const extract = input => {
        const data = [];
        input.replace(regexp, function (match, def, key) {
            data.push({
                def: def,
                key: key
            });
            return def;
        });
        return data;
    };

    const replace = input => input.replace(regexp, (match, def, key) => defined[key]);

    const replaceWithDefault = input => input.replace(regexp, (match, def, key) => def);

    /**
     * Collect all new keys to ask from given data
     * @param input - string
     */
    const collectToAsk = input => extract(input).map(x => ( (typeof defined[x.key] === 'undefined') && (defined[x.key] = asklist[x.key] = x.def) ));

    const processOne = (key, copy) => prompt( `${descriptions[key] || key} ` + (copy[key] ? `(default: ${copy[key]} ) : ` : ': ') );

    const ask = input => {

        input = input || '';

        collectToAsk(input);

        const keys = Object.keys(asklist);

        const copy = Object.assign({}, asklist);

        asklist = {};

        let ret;

        if (keys.length) {

            ret = parallel(keys, key => (new Promise(resolve => {

                (function again() {

                    processOne(key, copy).then(
                        value => {

                            value = value || trim(defined[key]);

                            if (value) {

                                return resolve(value);
                            }

                            again();
                        }
                    )
                }());

            }).then(value => {
                defined[key] = value;
            })));
        }
        else {
            ret = Promise.resolve();
        }

        return ret.then(() => replace(input));
    };

    ask.collectToAsk           = collectToAsk;

    ask.replaceWithDefault     = replaceWithDefault;

    ask.get = key => {

        if (key) {

            return defined[key];
        }

        return defined;
    }

    return ask;
};

