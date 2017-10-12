
// top level reducers file

import { combineReducers } from 'redux';

// import byId, * as fromById from './byId';

// import createList, * as fromList from './createList';

import loader, * as fromLoader from './loading';

import list, * as fromList from './list';

import form, * as fromForm from './form';

const reducers = combineReducers({
    form,
    loader,
    list
})

export default reducers;

// selectors
export const getLoaderStatus = state =>
    fromLoader.getLoaderStatus(state.loader);
//
export const getLoaderMsg = state =>
    fromLoader.getLoaderMsg(state.loader);

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
})

