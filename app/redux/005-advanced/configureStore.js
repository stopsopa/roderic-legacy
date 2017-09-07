
import { createStore /*, combineReducers */ } from 'redux';
import debounce from 'lodash/debounce';
import log from '../../../react/webpack/logw';
import todoApp from './reducers';

const logger = store => next => {

    if (!console || !console.group) {

        return next;
    }

    return action => {
        console.group(action.type);
            log('%c action', 'color:blue', action);
            log('%c prev', 'color:gray', store.getState());
            const returnValue = next(action);
            log('%c next', 'color: green', store.getState())
        console.groupEnd(action.type);
        return returnValue;
    }
};

const promiseMiddleware = store => next => action => {

    if (typeof action.then === 'function') {

        return action.then(next);
    }

    return next(action);
};

const wrapDispatchWithMiddlewares = (store, middlewares) => {
    middlewares.forEach(middleware => store.dispatch = middleware(store)(store.dispatch))
};

const configureStore = () => {

    const store = createStore(todoApp);

    const middlewares = [];

    if (process.env.NODE_ENV !== 'production') {

        middlewares.push(logger)
    }

    middlewares.push(promiseMiddleware);

    wrapDispatchWithMiddlewares(store, middlewares);

    return store;
};

export default configureStore;