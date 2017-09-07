
import { createStore /*, combineReducers */ } from 'redux';
import debounce from 'lodash/debounce';
import log from '../../../react/webpack/logw';
import todoApp from './reducers';

const addLoggingToDispatch = (store) => {
    const rawDispatch = store.dispatch;

    if (!console || !console.group) {

        return rawDispatch;
    }

    return (action) => {
        console.group(action.type);
            log('%c action', 'color:blue', action);
            log('%c prev', 'color:gray', store.getState());
            const returnValue = rawDispatch(action);
            log('%c next', 'color: green', store.getState())
        console.groupEnd(action.type);
        return returnValue;
    }
}

const configureStore = () => {

    const store = createStore(todoApp);

    if (process.env.NODE_ENV !== 'production') {

        store.dispatch = addLoggingToDispatch(store);
    }

    return store;
};

export default configureStore;