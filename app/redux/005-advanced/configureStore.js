
import { createStore /*, combineReducers */ } from 'redux';
import { loadState, saveState } from './localStorage';
import debounce from 'lodash/debounce';
import log from '../../../react/webpack/logw';
import todoApp from './reducers';

const configureStore = () => {

    const store = createStore(todoApp, loadState());

    store.subscribe(debounce(() => {

        const state = store.getState();

        const { visibilityFilter, ...save } = state;

        log('sub', save)

        saveState(save);
    }, 300));

    return store;
};

export default configureStore;