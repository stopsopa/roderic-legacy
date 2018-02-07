'use strict';

const path = require('path');

const fs = require('fs');

const log = (function () {try {return console.log}catch (e) {return function () {}}}());

const exit = (reason, status = 1) => {
    process.stderr.write(reason + "\n");
    process.exit(status);
}

const args = (function (obj, tmp) {
    process.argv
        .slice(2)
        .map(a => {

            if (a.indexOf('--') === 0) {

                tmp = a.substring(2).replace(/^\s*(\S*(\s+\S+)*)\s*$/, '$1');

                if (tmp) {

                    obj[tmp] = (typeof obj[tmp] === 'undefined') ? true : obj[tmp];
                }

                return;
            }

            if (a === 'true') {

                a = true
            }

            if (a === 'false') {

                a = false
            }

            if (tmp !== null) {

                if (obj[tmp] === true) {

                    return obj[tmp] = [a];
                }

                obj[tmp].push(a);
            }
        })
    ;

    Object.keys(obj).map(k => {
        (obj[k] !== true && obj[k].length === 1) && (obj[k] = obj[k][0]);
        (obj[k] === 'false') && (obj[k] = false);
    });

    return {
        all: () => JSON.parse(JSON.stringify(obj)),
        get: (key, def) => {

            var t = JSON.parse(JSON.stringify(obj));

            if (typeof def === 'undefined')

                return t[key];

            return (typeof t[key] === 'undefined') ? def : t[key] ;
        },
        update: data => {

            delete data['config'];

            delete data['dump'];

            delete data['help'];

            delete data['inject'];

            obj = data;
        }
    };
}({}));

if (args.get('help') || Object.keys(args.all()).length == 0) {

    var thisScript = path.basename(__filename);

    log(`
Changes found digit to next in the pool (if last then it takes first from pool)

Example:
    for parameters:
            --file test.conf
            --replace '/localhost:(\\d+)/g'
            --pool 82 83 84 85 86
        it changes all appearance of 'localhost:84' to 'localhost:85'
            or
        it changes all appearance of 'localhost:86' to 'localhost:82'
   
    
--file [path]                       - path to file where is something to change
--replace                           - /localhost:(\\d+)/g     
                                      WARNING: always surround with '/' on left side and '/g' on the right
                                      additionally it should contain (\\d+), (\\d*) or (\\d)
--pool                              - pool of numbers to change, integers separated by space
--help                              - this help page   

full example:

    node ${thisScript} --file /etc/httpd/conf.d/vhost.conf --replace '/localhost:(\\d+)/g' --pool 82 83 84 85 86
    
--next                              - provides just next number for given one

full examples:

    node ${thisScript} --next 67 --pool 56 43 32
        return 56    

    node ${thisScript} --next 56 --pool 56 43 32
        return 43                                  
    
`);

    process.exit(0);
}


let pool = args.get('pool');

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

if (typeof pool === 'string') {

    pool = [pool];
}

if (!isArray(pool)) {

    exit(`Wrong 'pool' parameter, check --help`);
}

pool = pool.map(i => parseInt(i, 10)).filter(i => i > 0);

if (pool.length < 1) {

    exit('parameter --pool should provide at least one number');
}

function change(num) {

    num = parseInt(num, 10);

    const index = pool.indexOf(num);

    if (index < 0) {

        return pool[0];
    }

    return pool[ (index + 1) % pool.length]
}

let next = args.get('next');

if (next !== undefined) {

    log(change(next));

    process.exit(0);
}

let file = args.get('file');

if (typeof file !== 'string' || !file) {

    exit(`Wrong 'file' parameter, check --help`);
}

let replace = args.get('replace');

if (typeof replace !== 'string' || !replace) {

    exit(`Wrong 'replace' parameter, check --help`);
}

if (/\(\\\\d[\+\*]?\)/.test(replace)) {

    exit(`regexp provided by parameter --replace should contain (\\d+), (\\d*) or (\\d)`);
}

file = path.resolve(file);

if ( ! fs.existsSync(file)) {

    exit(`file '${file}' doesn't exist`);
}

try {
    fs.accessSync(file, fs.constants.R_OK);
}
catch (e) {

    exit(`File '${file}' is not readdable...`);
}

try {
    fs.accessSync(file, fs.constants.W_OK);
}
catch (e) {

    exit(`File '${file}' is not writtable...`);
}

function trim(string, charlist, direction) {
    direction = direction || 'rl';
    charlist  = (charlist || '').replace(/([.?*+^$[\]\\(){}|-])/g,'\\$1');
    charlist  = charlist || " \\n";
    (direction.indexOf('r')+1) && (string = string.replace(new RegExp('^(.*?)['+charlist+']*$','gm'),'$1'));
    (direction.indexOf('l')+1) && (string = string.replace(new RegExp('^['+charlist+']*(.*)$','gm'),'$1'));
    return string;
}

const content = fs.readFileSync(file).toString();

replace = trim(replace, '/g');

log(`Changes in file ${file}\n`);

let found = '';

const newcontent = content.replace(new RegExp(replace, 'g'), function (piece, a, offset, all) {

    if (!found) {

        found = a;
    }

    const n = change(parseInt(a, 10));

    const line = all.substring(0, offset).split("\n").length;

    log(`changing in '${piece}' from '${a}' to '${n}', in file line: ${line}\n`);

    return piece.split(a).join(n);
});

fs.writeFileSync(file, newcontent);

log("done. last port was: \n");

log(found)











