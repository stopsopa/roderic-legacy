
// see also: npm install --save yeoman-generator - it updated automatically package.json to latest version
// yarn upgrade --latest -C
// if [ -e package.json ] ; then echo -e "$(node lock-to-package-json.js)" 1> package.json && echo 'done...'; fi

'use strict';

const path          = require('path');

const execSync      = require('child_process').execSync;

const cmd = `node ` + path.resolve(__dirname, 'node_modules', 'yarn', 'bin', 'yarn.js') + ` list --json --depth 0`;

const packageJson = require(path.resolve('package.json'));

try {

    const lockRaw       = execSync(cmd).toString();

    const lockObject    = JSON.parse(lockRaw);

    const isObject      = obj => Object.prototype.toString.call(obj) === '[object Object]';

    let tmp;

    const lockList = lockObject.data.trees.reduce((acc, val) => {

        tmp = val.name.split('@');

        acc[tmp[0]] = `^` + tmp[1];

        return acc;

    }, {});

    const process = key => {

        if (isObject(packageJson[key])) {

            Object.keys(packageJson[key]).forEach(name => {

                if (lockList[name]) {

                    packageJson[key][name] = lockList[name];
                }
            })
        }
    };

    process('devDependencies');

    process('dependencies');
}
catch (e) {

    console.error(e);
}

console.log(JSON.stringify(packageJson, null, '  '));
