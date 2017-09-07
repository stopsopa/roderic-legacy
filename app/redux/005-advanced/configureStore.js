
import { createStore /*, combineReducers */ } from 'redux';
import { loadState, saveState } from './localStorage';
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

    const store = createStore(todoApp, loadState());

    if (process.env.NODE_ENV !== 'production') {

        store.dispatch = addLoggingToDispatch(store);
    }

    store.subscribe(debounce(() => {

        const state = store.getState();

        const { visibilityFilter, ...save } = state;

        saveState(save);
    }, 300));

    return store;
};

export default configureStore;