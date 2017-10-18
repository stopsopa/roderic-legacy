
import * as config from './config';

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

export const fetchData = (path, opt, ...args) => {

    let ret;

    if (fakeTest(path)) {

        return fakeReturn(path);
    }
    else {
        args = [
            getUrl(path),
            {
                headers: {
                    Accept: 'application/json',
                },
                ...opt
            },
            ...args
        ];

        if (args[1].method) {

            args[1].method = args[1].method.toUpperCase();
        }

        ret = fetch(...args);
    }

    return delayPromise(delay || 0)
        .then(() => ret)
    ;
};

export const fetchJson = (...args) => fetchData(...args).then(res => res.json());

