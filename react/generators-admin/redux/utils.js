
const fs            = require('fs');

const path          = require('path');


const trimEnd       = require('lodash/trimEnd');

const upperFirst    = require('lodash/upperFirst');

const lowerFirst    = require('lodash/lowerFirst');

const trim          = require('lodash/trim');


const template      = require('./template');

const log = require('../../webpack/logn');


function preg_quote (str, delimiter) { // https://stackoverflow.com/a/6829401/5560682
    // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/preg_quote/
    // original by: booeyOH
    // improved by: Ates Goral (http://magnetiq.com)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    //   example 1: preg_quote("$40")
    //   returns 1: '\\$40'
    //   example 2: preg_quote("*RRRING* Hello?")
    //   returns 2: '\\*RRRING\\* Hello\\?'
    //   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:")
    //   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'
    return (str + '')
        .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&')
}


var walkSync = function(dir, filelist) { // https://gist.github.com/kethinov/6658166#gistcomment-1603591

    var p, files = fs.readdirSync(dir);

    filelist = filelist || [];

    files.forEach(function(file) {

        p = path.resolve(dir, file);

        if (fs.statSync(p).isDirectory()) {

            filelist = walkSync(p, filelist);
        }
        else {

            filelist.push(p);
        }
    });

    return filelist;
};

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

const tool = {
    inject: (targetContent, contentToAdd, start, end, append = true) => {

        const pre = preg_quote(start);

        const post = preg_quote(end);

        const reg = new RegExp(`^([\\s\\S]*?)(${pre})([\\s\\S]*?)(${post})([\\s\\S]*)$`, 'g');

        const pieces = reg.exec(targetContent);

        if ( ! pieces || pieces.length !== 6 ) {

            throw `Can't find placeholders in targetContent 
            
    start (${start}) 
    end (${end})
    content: >>>${targetContent}<<<
    
`
        }

        if (append) {

            pieces[3] += contentToAdd;
        }
        else {

            pieces[3] = contentToAdd + pieces[3];
        }

        return pieces.slice(1).join('');
    },
    read: (file, ps) => {

        if ( ! fs.existsSync(file) ) {

            throw `file "${file}" doesn't exist`;
        }

        // log.dump(file);
        //
        // process.exit(0);

        const data = fs.readFileSync(file).toString();

        const delimiter = '/****/';

        const chunks = data.split(delimiter);

        let metadata;

        try {

            metadata = trimEnd(chunks[0].replace(/^\s*(?:var|const|let)\s+[a-z0-9]+\s*=\s*(.*?)$/im, '$1'), " \r\n;");

            metadata = tool.template(metadata)(Object.assign({}, ps));

            metadata = JSON.parse(metadata);

            if ( ! (metadata.mode === 'inject' || metadata.mode === 'create-file') ) {

                throw `invalid metadata.mode value: ${metadata.mode}`;
            }
        }
        catch (e) {

            throw `Couldn't parse json metadata from file: '${file}',\nreason: ${e}`;
        }

        return {
            metadata: metadata,
            tmp: chunks.slice(1).join(delimiter)
        }
    },
    dirEnsure: dirEnsure,
    findFiles: dir => {

        let list = [];

        walkSync(dir, list);

        list = list.filter(file => {

            if (path.basename(file).indexOf('.') === 0) {

                return false;
            }

            return true;
        });

        return list;
    },
    preg_quote: preg_quote,
    template: function () {

        const args = Array.prototype.slice.call(arguments);

        try {

            const tmp = template.apply(this, args);

            return function () {
                try {

                    return tmp.apply(this, Array.prototype.slice.call(arguments));
                }
                catch(e) {

                    log.start();

                    log("Template error: (execution)", args[0]);

                    throw log.get();
                }
            }
        }
        catch(e) {

            log.start();

            log("Template error: (compiling)", args[0]);

            throw log.get();
        }
    },
    split: (function () {

        const splitInner = str => {

            let ret = str.replace(/(\d+)/g, "-$1-")

            ret = ret.split(/[^a-z0-9]/i);

            ret = ret.map(i => trim(i));

            ret = ret.filter(i => i);

            ret = ret.map(str => {

                if (str === str.toUpperCase()) {

                    return str;
                }

                let i = 0;

                const ret = [];

                let tmp, last = undefined; // true - upper, false - lower

                for (let e = 0, l = str.length ; e < l ; e += 1 ) {

                    tmp = str[e] === str[e].toUpperCase();

                    if (last === undefined) {

                        last = tmp;
                    }

                    if (tmp !== last) {

                        last = tmp;

                        if (tmp === true) {

                            i += 1;
                        }
                    }

                    if ( ! ret[i] ) {

                        ret[i] = '';
                    }

                    ret[i] += str[e];
                }

                if (ret.length > 1) {

                    return ret;
                }

                return ret[0] || '';
            });

            return ret;
        };

        const flat = list => {
            let tmp = [];

            list.forEach(i => {
                if (typeof i === 'string') {
                    tmp.push(i);
                }
                else {
                    tmp = tmp.concat(flat(i));
                }
            });

            return tmp;
        }

        return str => flat(splitInner(str));
    }()),
    method: list => {

        if (typeof list === 'string') {

            list = tool.split(list);
        }

        return lowerFirst(list.map(i => upperFirst(i.toLowerCase())).join(''));
    },
    dry: data => data
};

module.exports = tool;