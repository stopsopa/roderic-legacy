'use strict';

const ver = 'v0.1.0';

const path      = require('path');
const https     = require('https');
const fs        = require('fs');
const runSync   = require('child_process').spawnSync;
const Stream    = require('stream').Transform;

let args = {};

const prompt = (() => {

    // process.stdin.resume();

    process.stdin.setEncoding('utf8');

    const color = message => process.stdout.write(['\x1B[', 36, 'm', message + ' ', '\x1B[0m'].join(''));

    const tool = message => new Promise(resolve => {

        // tutorial: https://docs.nodejitsu.com/articles/command-line/how-to-prompt-for-command-line-input/

        // table of colors (octal): https://stackoverflow.com/a/41407246/5560682
        // test: console.log('\x1b[36m%s\x1b[0m', message);

        // can't use octal sequence sequences in strict mode so to convert:
        //      https://coderstoolbox.net/number/

        color(message);

        process.stdin.on('data', data => {
            resolve(trim(data));
        });

        // next: .then(data => { log(data); process.exit(0); });
    });

    tool.color = color;

    return tool;
})();

const error = err => {
    err = (err + '').split("\n").map(p => `    ${p}`).join("\n");
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
 * :defval::key: - where in place of defval can be empty string
 */
const fillIn = (function () {

    const regexp = /:([a-z0-9\._-]*)::([a-z0-9\._-]+):/ig;

    // var test = `one :defval1::key: two :defval2::key2: three :defval3::key3: end`;

    let asklist = { // found in data
    };

    const descriptions = {
        react_dir   : "Webpack directory: ",
        web_dir     : "Publicly available server directory: ",
        app_dir     : "Application directory (directory with your React components): ",
        root        : "Root directory of project (main directory to resolve any paths)",
        app_name    : "Name of this project"
    };

    const defined = { // collected from data, ready to ask
        // finalkey: finalvalue
        // app_dir: 'app'
    };

    process.argv
        .filter(a => a.indexOf('--') === 0)
        .map(a => a.substring(2))
        .filter(a => /^[^=]+=.+$/i.test(a))
        .map(a => {
            a = a.match(/^([^=]+)=(.+)$/);
            return {
                key: a[1],
                value: a[2]
            }
        })
        .forEach(v => {
            defined[v.key] = v.value;
        })
    ;

    (process.argv.indexOf('--onlyFix') > -1) && (args.onlyFix = true);

    args = Object.assign(args, defined);

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

    tool.collectToAsk           = collectToAsk;

    tool.replaceWithDefault     = replaceWithDefault;

    tool.get = key => defined[key];

    return tool;
}());

const transport = (source, target) => {

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

const fixFiles = (function () {

    const reg = /\/\/this will be removed by installator[\s\S]*?\/\/this will be removed by installator/g;

    return list => Promise.all(list.map(file => {

        if (file.template && fs.existsSync(file.source)) {

            let content = fs.readFileSync(file.source);

            if (content) {

                content = content.toString();

                return fillIn(content).then(content => {

                    content = content.replace(reg, '');

                    fs.writeFileSync(file.source, content)
                }).then(() => `changed: ${file.source}`);
            }
        }

        return Promise.resolve(`NOT changed: ${file.source}`);
    }));
}());

args.onlyFix || (function () {

    let list, def, fixed, webpackDir, yarn = !runSync('yarn', ['-v']).status;

    transport(`https://raw.githubusercontent.com/stopsopa/roderic/${ver}/install/files.json`)
        .then(data => {

            list    = data;

            fixed   = JSON.parse(JSON.stringify(data))

            def     = JSON.parse(JSON.stringify(data));

            list.forEach(one => fillIn.collectToAsk(one.source));

            return fillIn();
        })
        .then(() => {

            def.forEach( (one, key) => def[key].source = fillIn.replaceWithDefault(one.source));

            return Promise.all(
                fixed.map(
                    (one, key) => fillIn(one.source).then(text => fixed[key].source = text)
                )
            );
        })
        .then(() => {

            const overridden = fixed
                .filter(file => !file.ignoreOnLists)
                .map(file => file.source)
                .filter(file => fs.existsSync(path.resolve(__dirname, file)))
            ;

            if (overridden.length) {

                return new Promise(resolve => {

                    let listed = false;

                    (function again() {

                        if ( ! listed) {

                            listed = true;
                            process.stdout.write("\nFiles to override:\n\n");
                            overridden.forEach(path => {
                                process.stdout.write(`    ${path}\n`);
                            });
                            process.stdout.write("\n");
                        }

                        prompt("Do you agree to override these files ? (y|n)").then(answer => {

                            if (answer === 'y' || answer === 'n') {

                                return resolve(answer);
                            }

                            again();
                        });
                    }());
                });
            }

            return Promise.resolve('y');
        })
        .then(answer => {

            if (answer === 'n') {

                console.log(`\n    No, then good bye...\n`);

                process.exit(-1);
            }
        })
        .then(() => Promise.all(def.map( (deffile, index) => {

            deffile.ignoreOnLists || log(`downloading: ${fixed[index].source}`);

            return transport(
                `https://raw.githubusercontent.com/stopsopa/roderic/${ver}/${deffile.source}`,
                fixed[index].source
            );
        })))
        .then(() => {

            const checkFile = path.resolve(__dirname, '__check.js');

            let content = fs.readFileSync(checkFile);

            if (content) {

                content = content.toString();

                if (typeof content === 'string') {

                    try {
                        fs.unlinkSync(checkFile);
                    }
                    catch (e) {

                    }

                    return (content == '__check.js') || error("Content of file __check.js is invalid - download failed");
                }
            }

            error("File __check.js doesn't exist - download failed");
        })
        .then(() => { // aggretaging interactions with user

            fixed
                .filter(file => file.template)
                .forEach(file => {

                    let content = fs.readFileSync(file.source);

                    if (content) {

                        content = content.toString();

                        fillIn.collectToAsk(content); // collecting keys to ask for value
                    }
                })
            ;

            return fillIn(); // triggering aggregated interaction with user
        })
        .then(() => fixed)
        .then(fixFiles)
        .then(() => {

            const react_dir = fillIn.get('react_dir');

            webpackDir = path.resolve(__dirname, react_dir);

            process.chdir(webpackDir);

            prompt.color("\nWait ...");

            console.log(runSync('npm', ['install', 'yarn']).stdout.toString());

            // console.log(runSync('pwd').stdout.toString());

            const p = path.resolve(webpackDir, 'node_modules/yarn/bin/yarn.js');

            // console.log('p: ', p);

            // require(p);

            return new Promise(resolve => {
                const spawn = require('child_process').spawn;
                const child = spawn('node', [p]);
                child.stdout.on('data', data => process.stdout.write(data.toString()));
                child.stderr.on('data', data => process.stdout.write(data.toString()));
                child.on('close', code => {

                    process.chdir(__dirname);

                    resolve();
                });
            });
        })
        .then(() => {

            fixed.forEach(file => {

                file = path.resolve(file.source);

                const ext = path.extname(file);

                if (ext === '.dist') {

                    const newName = path.join(path.dirname(file), path.basename(file, ext));

                    fs.renameSync(file, newName);
                }

            })
        })
        .then(() => {

            const install = yarn ? 'yarn' : 'npm install';

            const react = fillIn.get('react_dir');

            log(`

now run:
    cd ${react}
    setup manually config.js
    
and next run one of:
    ${install} dev
  or
    ${install} prod
  or
    node node_modules/yarn/bin/yarn.js dev
  or
    node node_modules/yarn/bin/yarn.js prod

`);

            process.exit(0);
        })
        .catch(e => {

            log('catch:')

            console.log(e);

            error(e + '')

            process.exit(0);
        })
    ;
}());

// node install.js --onlyFix --app_dir=app --react_dir=react --web_dir=docs --root=".." --app_name=test-app
args.onlyFix && (function () {

    transport(`https://raw.githubusercontent.com/stopsopa/roderic/${ver}/install/files.json`)
        .then(
            list => Promise.all(
                list.map(
                    (o, k) => (fillIn(o.source).then(link => (list[k].source = link)))
                )
            )
            .then(() => list)
        )
        .then(fixFiles)
        .then(list => {
            console.log(list)
        })
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

function log() {
    Array.prototype.slice.call(arguments).map(i => i + "\n").forEach(i => process.stdout.write(i));
};

