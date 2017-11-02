
import * as config from './public.config';

import 'isomorphic-fetch';

export const delay = config.delay;

import delayPromise from '../react/webpack/delay';

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

        ret = fetch(getUrl(path), ...rest);
    }

    return delayPromise(delay || 0)
        .then(() => ret)
    ;
};

export const fetchJson = (path, opt = {}, ...rest) => {

    opt.headers = {
        ...opt.headers,
        Accept: 'application/json'
    };

    return fetchData(path, opt, ...rest)
        .then(res => res.json())
    ;
}

