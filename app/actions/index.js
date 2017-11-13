


import { fetchJson, fetchData } from '../transport';

import {
    getLoaderStatus,
    getLoading,
    getFormData
} from '../reducers';

export const errorHandler = (dispatch) => {
    return error => {

        dispatch(loaderError(`Server error: ${error}`))

        return 'failure';
    }
}

// loader vvv
export * from './loader';
// loader ^^^

// jwt vvv
export * from './jwt';
// jwt ^^^

// list vvv
export * from './list';
// list ^^^




// before splitting actions to separate files - deprecated vvv

export const FORM_ITEM_URL_CHANGE       = 'FORM_ITEM_URL_CHANGE';
export const FORM_ITEM_URL_RESET        = 'FORM_ITEM_URL_RESET';
export const FORM_ITEM_STATUS_CHANGE    = 'FORM_ITEM_STATUS_CHANGE';
export const FORM_ITEM_STATUS_RESET     = 'FORM_ITEM_STATUS_RESET';
export const FORM_ITEM_INTERVAL_CHANGE  = 'FORM_ITEM_INTERVAL_CHANGE';
export const FORM_ITEM_INTERVAL_RESET   = 'FORM_ITEM_INTERVAL_RESET';

export const FORM_ITEM_FETCH_SUCCESS    = 'FORM_ITEM_FETCH_SUCCESS';

export const formItemFetchRequest = (id) => (dispatch, getState) => {

    dispatch(loaderOn());

    fetchJson(`/page/${id}`)
        .then(
            response => {

                dispatch(loaderOff());

                if (response.data) {

                    return dispatch({
                        type: FORM_ITEM_FETCH_SUCCESS,
                        data: response.data
                    })
                }

                errorHandler(dispatch)("Wrong response data format");
            },
            errorHandler(dispatch)
        );
};

export const formSubmit = id => (dispatch, getState) => {

    const state = getState();

    dispatch(loaderOn());

    // return resolved no matter what
    return new Promise((resolve) => {

        let url = `/page`;
        let method = 'POST';

        if (id) {

            method = 'PUT';
            url += `/${id}`;
        }

        fetchData(url, {
            method,
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                data: getFormData(state)
            } || {})
        })
        .then(response => {

            if (id) {

                return response;
            }

            return response.json();
        })
        .then(response => {

            dispatch(loaderOff());

            if (id) {

                if (response.status !== 204) {

                    errorHandler(dispatch)("Wrong response data format after edit");

                    return resolve('error')
                }

                setTimeout(() => dispatch(loaderMessage('Endpoint edited successfully ...')), 500);

                return resolve(id)
            }
            else {

                if (response.data) {

                    dispatch({
                        type: FORM_ITEM_URL_CHANGE,
                        value: response.data.url
                    });

                    dispatch({
                        type: FORM_ITEM_INTERVAL_CHANGE,
                        value: response.data.interval
                    });

                    dispatch({
                        type: FORM_ITEM_STATUS_CHANGE,
                        value: response.data.laststatus
                    });

                    setTimeout(() => dispatch(loaderMessage('Endpoint created successfully ...')), 500);

                    return resolve(response.data._id)
                }
                else {

                    errorHandler(dispatch)("Wrong response data format after create");

                    return resolve('error')
                }
            }
        }, error => {

            if (id) {

                log('edit error - never happen on server :/')
            }
            else {

                errorHandler(dispatch)("Duplicate url");

                return resolve('error')
            }
        })
    });
};

export const formChangeUrl = value => ({
    type: FORM_ITEM_URL_CHANGE,
    value
});

export const formChangeStatus = value => ({
    type: FORM_ITEM_STATUS_CHANGE,
    value
});

export const formChangeInterval = value => ({
    type: FORM_ITEM_INTERVAL_CHANGE,
    value
});

export const formReset = () => (dispatch, getState) => {
    dispatch({
        type: [
            FORM_ITEM_URL_RESET,
            FORM_ITEM_INTERVAL_RESET,
            FORM_ITEM_STATUS_RESET
        ]
        // type: FORM_ITEM_URL_RESET
    });
}

// nested vvv

export const NESTED_LOAD = 'NESTED_LOAD';

export const nestedLoad = value => (dispatch, getState) => new Promise(resolve => {
    setTimeout(() => {
        dispatch({
            type: NESTED_LOAD,
            payload: value
        });
        resolve('done');
    }, 500);
});

// nested ^^^

