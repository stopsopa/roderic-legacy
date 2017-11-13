
import { fetchJson, fetchData } from '../transport';

import {
    FETCH_LIST_SUCCESS,
    FETCH_LIST_FAILURE,
    FETCH_LIST_REQUEST,
    LIST_DELETE_CANCEL,
    LIST_DELETE_SHOW,
    LIST_DELETE_DELETE
} from './types';

import {
    getLoaderStatus,

} from '../reducers';

import {
    loaderOn,
    loaderOff,
    errorHandler,
    loaderError
} from './index';

export const fetchList = () => (dispatch, getState) => {

    const state = getState();

    if (getLoaderStatus(state) === 'on') {

        log('is loading now - stop and return promise', state);

        return Promise.resolve('cancel');
    }

    dispatch(loaderOn());

    return fetchJson('/pages')
        .then(
            response => {

                dispatch(loaderOff());

                dispatch({
                    type: FETCH_LIST_SUCCESS,
                    list: response.data
                });

                return 'success';
            },
            errorHandler(dispatch)
        );
}

export const showDelete = (id) => {
    return {
        type: LIST_DELETE_SHOW,
        id: id
    }
};

export const cancelDelete = () => {
    return {
        type: LIST_DELETE_CANCEL
    };
}

export const deleteElementFromList = (id) => (dispatch, getState) => {

    const state = getState();

    dispatch(cancelDelete());

    dispatch(loaderOn());

    return fetchData(`/page/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.status)
        .then(
            response => {

                dispatch(loaderOff());

                if (response === 204) {

                    dispatch(fetchList())

                    return 'success'
                }

                dispatch(loaderError('Server error: wrong status code'))

                return 'success';
            },
            errorHandler(dispatch)
        );
}