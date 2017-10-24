'use strict';

const ver = 'v0.1.0';

const path          = require('path');
const fs            = require('fs');
const execSync      = require('child_process').execSync;
const spawn         = require('child_process').spawn;
const color         = require('./libs/color');
const prompt        = require('./libs/prompt');
const error         = require('./libs/error');
const log           = require('./libs/log');
const transport     = require('./libs/transport');
const fixFiles      = require('./libs/fixFiles');

const args = (function () {

    const obj = {};

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
            obj[v.key] = v.value;
        })
    ;

    (process.argv.indexOf('--onlyFix') > -1) && (obj.onlyFix = true);

    (process.argv.indexOf('--travis') > -1)  && (obj.travis = true);

    return obj;
}());

const ask    = require('./libs/ask')(args);

const yarn = (function () {
    function yarnCheck() {
        try {
            execSync('yarn -v');
            return true;
        }
        catch (error) {
            return false;
            // return 'npm install'
            // return error;
            // log('error', error)
            // error.status;  // Might be 127 in your example.
            // error.message; // Holds the message you typically want.
            // error.stderr;  // Holds the stderr output. Use `.toString()`.
            // error.stdout;  // Holds the stdout output. Use `.toString()`.
        }
    };
    return yarnCheck();
}());

args.onlyFix || (function () {

    let list, def, fixed, webpackDir;

    transport(`https://raw.githubusercontent.com/stopsopa/roderic/${ver}/install/files.json`) // fetching list of files to download
        .then(data => { // preparing lists

            list    = data;

            fixed   = JSON.parse(JSON.stringify(data))

            def     = JSON.parse(JSON.stringify(data));

            list.forEach(one => ask.collectToAsk(one.source));

            return ask();
        })
        .then(() => { // generating files list with default paths for downloading

            def.forEach( (one, key) => def[key].source = ask.replaceWithDefault(one.source));

            return Promise.all(
                fixed.map(
                    (one, key) => ask(one.source).then(text => fixed[key].source = text)
                )
            );
        })
        .then(() => { // asking if should override ?

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
        .then(answer => { // conditional exit if user don't want to override

            if (answer === 'n') {

                console.log(`\n    No, then good bye...\n`);

                process.exit(-1);
            }
        })
        .then(() => Promise.all(def.map( (deffile, index) => { // downloading files

            deffile.ignoreOnLists || log(`downloading: ${fixed[index].source}`);

            return transport(
                `https://raw.githubusercontent.com/stopsopa/roderic/${ver}/${deffile.source}`,
                fixed[index].source
            );
        })))
        .then(() => { // testing __check.js

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

                        ask.collectToAsk(content); // collecting keys to ask for value
                    }
                })
            ;

            return ask(); // triggering aggregated interaction with user
        })
        .then(() => fixed)
        .then(fixFiles) // remove comments "this will be removed by installator"
        .then(() => fixed.forEach(file => { // copy config.js.dist to config.js

            file = path.resolve(file.source);

            const ext = path.extname(file);

            if (ext === '.dist') {

                const newName = path.join(path.dirname(file), path.basename(file, ext));

                fs.renameSync(file, newName);
            }

        }))
        .then(() => {

            const react_dir = ask.get('react_dir');

            webpackDir = path.resolve(__dirname, react_dir);

            process.chdir(webpackDir);

            color("\nWait ...");

            console.log(execSync('npm install yarn').toString());

            const p = path.resolve(webpackDir, 'node_modules/yarn/bin/yarn.js');

            return new Promise(resolve => {
                const child = spawn('node', [p]);
                child.stdout.on('data', data => process.stdout.write(data.toString()));
                child.stderr.on('data', data => process.stdout.write(data.toString()));
                child.on('close', code => {

                    process.chdir(path.resolve(__dirname));

                    resolve();
                });
            });
        })
        .then(() => {

            const install = yarn ? 'yarn' : 'npm run';

            const react = ask.get('react_dir');

            log(`

now run:
    cd ${react}
    setup manually config.js
    
and next run one of:
    ${install} dev
  or
    ${install} prod

`);

            process.exit(0);
        })
        .catch(e => {

            log('catch:')

            console.log(e);

            error(e + '')

            process.exit(-1);
        })
    ;
}());

// If you want to change files for development copy this file one directory up and run:

// node install.js --onlyFix --app_dir=app --react_dir=react --web_dir=docs --root=".." --app_name=test-app
// node install.js --onlyFix --travis --app_dir=app --react_dir=react --web_dir=docs --root=".." --app_name=test-app
// node install.entry.js --onlyFix --app_dir=app --react_dir=react --web_dir=docs --root=".." --app_name=test-app
args.onlyFix && transport(`https://raw.githubusercontent.com/stopsopa/roderic/${ver}/install/files.json`)
    .then(
        list => Promise.all(
            list.map(
                (o, k) => (ask(o.source).then(link => (list[k].source = link)))
            )
        )
        .then(() => list)
    )
    .then(fixFiles)
    .then(list => {
        console.log(list)
    })
;

