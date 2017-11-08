
// top level reducers file

import { combineReducers } from 'redux';

// import byId, * as fromById from './byId';

// import createList, * as fromList from './createList';

import loader, * as fromLoader from './loading';

import list, * as fromList from './list';

import form, * as fromForm from './form';

import nested, * as fromNested from './nested';

import authenticated, * as fromAuthenticated from './authenticated';

const reducers = combineReducers({
    form,
    loader,
    list,
    authenticated,
    nested
})

export default reducers;

// selectors
export const getAuthenticated = state =>
    fromAuthenticated.getAuthenticated(state.authenticated);

export const getUsername = state =>
    fromAuthenticated.getUsername(state.authenticated);

export const getLoginError = state =>
    fromAuthenticated.getLoginError(state.authenticated);

export const getLoaderStatus = state =>
    fromLoader.getLoaderStatus(state.loader);

export const getLoading = state =>
    fromLoader.getLoading(state.loader);

export const getLoaderMsg = state =>
    fromLoader.getLoaderMsg(state.loader);

export const getLoaderButtonVisible = state =>
    fromLoader.getLoaderButtonVisible(state.loader);

export const getList = state =>
    fromList.getIds(state.list).map(id => fromList.getById(state.list, id));

export const getDelElement = state =>
    fromList.getById(state.list, fromList.getDel(state.list));

export const getFormValue = (state, key) =>
    fromForm.getValue(state.form, key);

export const getFormData = state => ({
    laststatus  : getFormValue(state, 'laststatus'),
    interval    : getFormValue(state, 'interval'),
    url         : getFormValue(state, 'url'),
});

// nested vvv
export const getNested = state =>
    fromNested.getNested(state.nested);
// nested ^^^

