
// top level reducers file

import { combineReducers } from 'redux';

import byId, * as fromById from './byId';

import createList, * as fromList from './createList';

const todos = combineReducers({
    byId,
    listByFilter: combineReducers({
        all         : createList('all'),
        active      : createList('active'),
        completed   : createList('completed')
    })
})

export default todos;

// selector
// https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers
export const getVisibleTodos = (
    state,
    filter = 'all'
) => {

    const ids = fromList.getIds(state.listByFilter[filter]);

    return ids.map(id => fromById.getTodo(state.byId, id));
};

export const getIsFetching = (state, filter = 'all') => {

    return fromList.getIsFetching(state.listByFilter[filter])
}
