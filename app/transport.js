
import * as config from './public.config';

import 'isomorphic-fetch';

export const delay = config.delay;

import delayPromise from '../:react::react_dir:/webpack/delay';

import { fakeTest, fakeReturn } from './transport-fake';

export const getUrl = (path = '') => {

    if (/^https?:\/\//.test(path)) {

        return path;
    }

    return `http://${config.pingserver}${path}`;
}

export const fetchData = (path, ...rest) => {

    let ret;

    if (fakeTest(path)) {

        ret = fakeReturn(path);
    }
    else {

        const args = [getUrl(path), ...rest];

        ret = fetch(...args)
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

if (typeof window !== 'undefined') {

    window.fetchData = fetchData;

    window.fetchJson = fetchJson;
}



