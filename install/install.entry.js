'use strict';

const ver = 'v0.1.0';

const path      = require('path');
const fs        = require('fs');
const runSync   = require('child_process').spawnSync;
const color     = require('./libs/color');
const prompt    = require('./libs/prompt');
const error     = require('./libs/error');
const log       = require('./libs/log');
const transport = require('./libs/transport');
const fixFiles  = require('./libs/fixFiles');

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
            defined[v.key] = v.value;
        })
    ;

    (process.argv.indexOf('--onlyFix') > -1) && (obj.onlyFix = true);

    return obj;
}());

const ask    = require('./libs/ask')(args);

args.onlyFix || (function () {

    let list, def, fixed, webpackDir, yarn = !runSync('yarn', ['-v']).status;

    transport(`https://raw.githubusercontent.com/stopsopa/roderic/${ver}/install/files.json`)
        .then(data => {

            list    = data;

            fixed   = JSON.parse(JSON.stringify(data))

            def     = JSON.parse(JSON.stringify(data));

            list.forEach(one => ask.collectToAsk(one.source));

            return ask();
        })
        .then(() => {

            def.forEach( (one, key) => def[key].source = ask.replaceWithDefault(one.source));

            return Promise.all(
                fixed.map(
                    (one, key) => ask(one.source).then(text => fixed[key].source = text)
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

                        ask.collectToAsk(content); // collecting keys to ask for value
                    }
                })
            ;

            return ask(); // triggering aggregated interaction with user
        })
        .then(() => fixed)
        .then(fixFiles)
        .then(() => fixed.forEach(file => {

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

                    process.chdir(path.resolve(__dirname));

                    resolve();
                });
            });
        })
        .then(() => {

            const install = yarn ? 'yarn' : 'npm install';

            const react = ask.get('react_dir');

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

