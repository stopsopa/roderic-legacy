
const path = require('path');

const fs = require('fs');

function trim(s) {
    return (s || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/,'$1');
}

const defOpt = {
    timeout: 10
};

let globOpt = {};

const now = () => parseInt((new Date()).getTime() / 1000, 10);

const cache = {

};

const regex = /\/api\/json\/(.+)/;

const setup = opt => {

    if ( ! opt.dir ) {

        throw `No directory specified`;
    }

    if ( ! fs.existsSync(opt.dir) ) {

        throw `Directory ${opt.dir} doesn't exist`;
    }

    globOpt = Object.assign(defOpt, opt);
};

const get = param => {

    const
        n       = now(),
        keys    = Object.keys(cache)
    ;

    for ( let t, k, i = 0, l = keys.length ; i < l ; i += 1 ) {

        k = keys[i];

        if (k === param) {

            t = cache[k];

            if ( (n - t.created) <= globOpt.timeout ) {

                return t.content;
            }

            return null;
        }
    }

    return null;
};

const set = (path, content) => (cache[path] = {
    content,
    created: now()
});

/**
 * First call setup();
 */
const getDataFromJsonFile = (param) => {

    let content     = null;

    let error       = null;

    let status      = null;

    content = get(param);

    if ( content === null ) {

        const file = path.resolve(globOpt.dir, `${param}.json`);

        if (fs.existsSync(file)) {

            content = fs.readFileSync(file).toString();

            set(param, content);

            status = `cache just refreshed`;
        }
        else {

            error = `file: ${file} not found`;
        }
    }
    else {

        status = `from cache`;
    }

    return {
        content,
        error,
        status
    };
};

/**
 * express middleware
 */
const tool = opt => {

    setup(opt);

    return (req, res) => {

        const param     = trim(req.params[0]);

        let tmp = {
            error: null,
            status: null,
            content: null
        };

        if (param) {

            tmp = getDataFromJsonFile(param);
        }

        (tmp.error !== null) && (res.set('X-api-error', tmp.error));

        (tmp.status !== null) && (res.set('X-api-status', tmp.status));

        if (tmp.content === null) {

            res
                .status(404)
                .end()
            ;
        }
        else {

            res
                .set('Content-type', 'application/json; charset=utf-8')
                .send(tmp.content)
            ;
        }
    };
};


tool.regex      = regex;

tool.getDataFromJsonFile    = getDataFromJsonFile;

tool.setup      = setup;

module.exports = tool;