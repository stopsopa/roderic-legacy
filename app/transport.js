
import * as config from './public.config';

// import 'isomorphic-fetch';
import './libs/ajax-fetch';

export const delay = config.delay;

import delayPromise from '../react/webpack/delay';

import { fakeTest, fakeReturn } from './transport-fake';

let token;

import node from 'detect-node';

// remove that later if read api with data in db will be implemented vvv
let fetchDataDirectly = () => {};

if (node) {

    const nodePath = eval('require')('path');

    const jsonFilesCacheMiddleware = eval('require')(nodePath.resolve(__dirname, 'libs', 'jsonFilesCacheMiddleware'));

    let regex = jsonFilesCacheMiddleware.regex;

    jsonFilesCacheMiddleware.setup(config.jsonApi);

    fetchDataDirectly = path => {

        if (node) {

            if (config.jsonApi.inNodeFetchDirectFromFiles) {

                if (regex.test(path)) {

                    var param = path.match(regex)[1];

                    var data = jsonFilesCacheMiddleware.getDataFromJsonFile(param);

                    if (data) {

                        if (data.content) {

                            // log(`found data by param '${param}' ` + data.status)

                            return JSON.parse(data.content)
                        }
                        else {
                            // log(`no 'content' field for param '${param}'`, data);
                        }
                    }
                }
            }
            else {
                log(`path: ${param}, can't fetch directly, inNodeFetchDirectFromFiles disabled`);
            }
        }
    }
}
// remove that later if read api with data in db will be implemented ^^^

export const getUrl = (path = '') => {

    if (/^https?:\/\//.test(path)) {

        return path;
    }

    if (node) {

        return `http://${config.pingserver}${path}`;
    }

    return path;

}

export const fetchData = (path, ...rest) => {

    let ret;

    if (fakeTest(path)) {

        ret = fakeReturn(path);
    }
    else {

        const args = [getUrl(path), ...rest];

        ret = server(...args)
            .then(res => res.ok ? res : Promise.reject({
                req: [...args],
                res: res
            }))
        ;
    }

    return delayPromise(delay || 0)
        .then(() => ret)
        ;
};


export const fetchJson = (path, opt = {}, ...rest) => {

    // remove that later if read api with data in db will be implemented vvv
    const data = fetchDataDirectly(path);

    if (data) {

        return Promise.resolve(data);
    }
    // remove that later if read api with data in db will be implemented ^^^

    opt.headers = {
        ...opt.headers,
        Accept: 'application/json',
        'Content-type' : 'application/json; charset=utf-8'
    };

    if (opt.body && typeof opt.body !== 'string') {

        opt.body = JSON.stringify(opt.body);
    }

    return fetchData(path, opt, ...rest)
        .then(res => res.json())
        ;
};

export const fetchCatch = (data, level = 4) => {
    log('fetchCatch');
    try {
        data = Object.assign({
            _time: (new Date()).toISOString().substring(0, 19).replace('T', ' ')
        }, data);
    }
    catch (e) {
        log('fetchCatch - catch', e)
    }
    log.stack(1).dump(data, level);
}

export const getToken = () => {
    return token;
}
export const setToken = value => {
    token = value;
}
export const clearToken = () => {
    token = undefined;
}
export const isToken = () => {
    return token === undefined;
}

if (!node) {

    window.fetchData    = fetchData;

    window.fetchJson    = fetchJson;

    window.fetchCatch   = fetchCatch;
}



