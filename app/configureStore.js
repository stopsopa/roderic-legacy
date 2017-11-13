
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import isArray from 'lodash/isArray';
import getDisplayName from 'react-display-name';

// middlewares
import { createLogger } from 'redux-logger';
import promisify from 'redux-promise';
import thunk from 'redux-thunk';

// for getData
import { matchPath } from 'react-router';
import routes from './routes';

const wrapDispatchWithMiddlewares = (store, middlewares) => {
    middlewares.forEach(middleware => store.dispatch = middleware(store)(store.dispatch))
};

const dom = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

const triggerMultiple = store => next => action => {

    if (isArray(action.type)) {

        return action.type.forEach(a => next({
            type: a
        }));
    }

    return next(action);
};

const configureStore = preloadedState => {

    const middlewares = [triggerMultiple, thunk, promisify];

    // http://extension.remotedev.io/#usage
    let composeEnhancers = compose;

    if (dom && process.env.NODE_ENV !== 'production') {

        middlewares.push(createLogger());

        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    }

    if (preloadedState) {

        return createStore(
            reducers,
            preloadedState,
            composeEnhancers(
                applyMiddleware(...middlewares) // applyMiddleware returns an redux enhancer
            )
        );
    }
    return createStore(
        reducers,
        composeEnhancers(
            applyMiddleware(...middlewares) // applyMiddleware returns an redux enhancer
        )
    );

};

export default configureStore;

export const fetchData = (url, store) => {

    const route = routes.find(route => matchPath(url, route));

    let
        promise,
        foundComponent  = (route && route.component),
        componentName   = foundComponent ? getDisplayName(route.component) : '<displayName>',
        isFetchData     = (foundComponent && typeof route.component.fetchData === 'function')
    ;

    if ( foundComponent ) {
        if ( isFetchData ) {

            try {

                promise = route.component.fetchData(store, matchPath(url, route));
            }
            catch (e) {

                const reason = {
                    message: `executing fetchData crashed in component: ${componentName}, route: ${url}, reason: `,
                    exception: e
                }
                /**
                 * Find how to find name/namespace of component
                 */
                log(reason.message, reason.exception);

                return Promise.reject(reason);
            }
        }
        else {

            log(`fetchData not found in component: ${componentName}, route: ${url}`);
        }
    }
    else {

        log('component behind router not found, url: ', url);
    }

    log(`in component: ${componentName}, route: ${url}, promise: `, promise)

    if (isFetchData && ( ! promise || typeof promise.then !== 'function') ) {

        log(`fetchData should return promise in component: ${componentName}, route: ${url}`, ' returned: ', promise);
    }

    return Promise.resolve(promise);
}

