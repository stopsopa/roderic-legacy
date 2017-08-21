
import log from '../../../react/webpack/logw';

const key = 'store';

export const loadState = () => {
    try {
        const state = localStorage.getItem(key);

        if (state === null) {

            return undefined;
        }

        const data = JSON.parse(state);

        log('read', data);

        return data;
    }
    catch (e) {
        log('loadState error: ', e)
        return undefined;
    }
}

export const saveState = (state) => {
    try {
        localStorage.setItem(key, JSON.stringify(state));
    }
    catch (e) {
        log('saveState error: ', e, 'state: ', state)
        // ignore
    }
}