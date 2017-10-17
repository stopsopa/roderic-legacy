'use strict';

const ver = 'v0.0.2';

const path      = require('path');
const https     = require('https');
const fs        = require('fs');

const log       = console.log;

const prompt = (() => {

    // process.stdin.resume();

    process.stdin.setEncoding('utf8');

    return message => new Promise(resolve => {

        // tutorial: https://docs.nodejitsu.com/articles/command-line/how-to-prompt-for-command-line-input/

        // table of colors (octal): https://stackoverflow.com/a/41407246/5560682
        // test: console.log('\x1b[36m%s\x1b[0m', message);

        // can't use octal sequence sequences in strict mode so to convert:
        //      https://coderstoolbox.net/number/

        process.stdout.write(['\x1B[', 36, 'm', message + ' ', '\x1B[0m'].join(''));

        process.stdin.on('data', resolve);

        // next: .then(data => { log(data); process.exit(0); });
    });
})();


// prompt('test:').then(data => log('data', data));


// process.exit(0);


// var k = 'test:defval::keyname: something else :val2::key: ddd : again:::key:draka :1val:key koniec';
//
// log(p.split(k));
//
// log('end.....>');
// process.exit(0);

const error = err => {
    err = err.split("\n").map(p => `    ${p}`).join("\n");
    process.stderr.write(`\nerror: \n\n${err}\n\n`);
    process.exit(-1);
};

// https://gist.github.com/stopsopa/33452ebcb50c53e38225beb60edd5e66
const parallel = function (input, execute, slots) {
    const output = [];
    let count = 0;
    (slots > 0) || (slots = 1);
    return new Promise(function (resolve) {
        (function next() {
            if (input.length) {
                if (count < slots) {
                    count += 1;
                    execute(input.shift()).then(function (data) {
                        output.push(data);
                        count -= 1;
                        next();
                    });
                    next();
                }
                return;
            }
            count || resolve(output);
        }());
    });
};
/**
 * :defval::key: - where defval can be empty
 */
const fillIn = (function () {

    const regexp = /:([^:]*)::([^:]+):/g;

    // var test = `one :defval1::key: two :defval2::key2: three :defval3::key3: end`;

    let asklist = { // found in data
        // key : default value
    };

    const comments = {
        react_dir: "Directory for webpack and all project repositories: "
    };

    const defined = { // collected from data, ready to ask
        // finalkey: finalvalue
    };

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

    const processOne = (key, copy) => prompt( `${comments[key] || key} ` + (copy[key] ? `(default:${copy[key]}) : ` : ': ') );

    const tool = input => {

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

                            value = trim(value) || trim(defined[key]);

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

    tool.collectToAsk           = collectToAsk;

    tool.replaceWithDefault     = replaceWithDefault;

    return tool;
}());

const transport = (source, target) => {

    return new Promise((resolve, reject) => {

        const url = `${source}?${new Date()*1}`;

        target && log(`transporting: ${target}`);

        const request = https.get(url, response => {

            if (response.statusCode === 200) {

                if ( ! target) {

                    let body = '';

                    response.on('data', chunk => body += chunk);

                    return response.on('end', () => {

                        const json = JSON.parse(body);

                        if (json) {

                            return resolve(json)
                        }

                        error(`Couldn't decode json: ${source}`);
                    });
                }

                dirEnsure(path.dirname(target), true);

                const file = fs.createWriteStream(target);

                response.pipe(file);

                file.on('finish', () => file.close());

                return resolve();
            }

            error(`Downloading ${url} failed,\nhttp status code: ${response.statusCode}`);
        });

        request.on('error', error);
    });
};


(function () {

    let list, def, fixed;

    transport(`https://raw.githubusercontent.com/stopsopa/roderic/${ver}/install/files.json`)
        .then(() => [
            // {
            //     "source": ":app::app_dir:/transport.js"
            // },
            // {
            //     "source": ":app::app_dir:/routes.js"
            // },
            // {
            //     "source": ":app::app_dir:/index.server.html"
            // },
            // {
            //     "source": ":app::app_dir:/index.server.js"
            // },
            // {
            //     "source": ":app::app_dir:/index.entry.js"
            // },
            // {
            //     "source": ":app::app_dir:/config.js.dist"
            // },
            // {
            //     "source": ":app::app_dir:/configureStore.js"
            // },
            // {
            //     "source": ":docs::web_dir:/favicon.ico"
            // },
            {
                "source": ":docs::web_dir:/.gitignore"
            },
            {
                "source": ":react::react_dir:/config.js"
            },
            {
                "source": ":react::react_dir:/webpack.config.js"
            },
            {
                "source": ":react::react_dir:/yarn.lock"
            },
            {
                "source": ":react::react_dir:/package.json"
            },
            {
                "source": ":react::react_dir:/.gitignore"
            },
            {
                "source": ":react::react_dir:/server.js"
            },
            {
                "source": ":react::react_dir:/webpack/logn.js"
            },
            {
                "source": ":react::react_dir:/webpack/logw.js"
            },
            {
                "source": ":react::react_dir:/webpack/rootrequire.js"
            },
            {
                "source": ":react::react_dir:/webpack/utils.js"
            },
            {
                "source": "__check.js"
            }
        ])
        .then(data => {

            list    = data;

            fixed   = JSON.parse(JSON.stringify(data));

            def     = JSON.parse(JSON.stringify(data));
        })
        .then(() => {

            list.forEach(one => fillIn.collectToAsk(one.source));

            return fillIn();
        })
        .then(data => {

            def.forEach( (one, key) => def[key].source = fillIn.replaceWithDefault(one.source) );

            return Promise.all(fixed.map( (one, key) => fillIn(one.source).then(text => fixed[key].source = text) ));
        })
        .then(() => Promise.all(def.map( (deffile, index) => transport(
            `https://raw.githubusercontent.com/stopsopa/roderic/${ver}/${deffile.source}`,
            fixed[index].source
        ))))
        .then(() => {

        })
        .then(() => log('all done...'))
    ;
}());







































function trim(s) {
    return (s || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/,'$1');
}

/**
 * Implementation from:
 * https://github.com/substack/node-mkdirp/blob/master/index.js
 */
function sync (p, opts, made) {

    var _0777 = parseInt('0777', 8);

    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }

    var mode = opts.mode;
    var xfs = opts.fs || fs;

    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }

    if (!made) made = null;

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

function dirEnsure(dir, createIfNotExist) {

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
