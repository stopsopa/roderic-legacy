


import { fetchJson, fetchData } from '../transport';

import {
    getLoaderStatus,
    getLoading,
    getFormData
} from '../reducers';

const errorHandler = (dispatch) => {
    return error => {

        dispatch(loaderError(`Server error: ${error}`))

        return 'failure';
    }
}
// ===========================

// loader vvv
export const LOADER_ON      = 'LOADER_ON';
export const LOADER_OFF     = 'LOADER_OFF';
export const LOADER_ERROR   = 'LOADER_ERROR';
export const LOADER_MESSAGE = 'LOADER_MESSAGE';
export const LOADER_BUTTONS_SHOW = 'LOADER_BUTTONS_SHOW';
export const LOADER_BUTTONS_HIDE = 'LOADER_BUTTONS_HIDE';

export const loaderButtonsShow = () => ({type:LOADER_BUTTONS_SHOW});
export const loaderButtonsHide = () => ({type:LOADER_BUTTONS_HIDE});

export const loaderOn = () => {
    return {
        type: LOADER_ON
    }
}

export const loaderOff = () => {
    return {
        type: LOADER_OFF
    }
}

const definition = function (type) {

    let handler = null;

    return (msg, time) => (dispatch, getState) => {

        dispatch({
            type,
            msg
        });

        clearTimeout(handler);

        handler = setTimeout(() => {

            dispatch(loaderOff());

        }, time || 5000);
    }
};
export const loaderError    = definition(LOADER_ERROR);
export const loaderMessage  = definition(LOADER_MESSAGE);
// loader ^^^

// jwt vvv
// https://auth0.com/blog/secure-your-react-and-redux-app-with-jwt-authentication/
// https://github.com/auth0-blog/nodejs-jwt-authentication-sample
// https://github.com/auth0-blog/redux-auth

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGIN_SIGNOUT  = 'LOGIN_SIGNOUT'

export const loginRequest = (username, password) => (dispatch, getState) => {

    const state = getState();

    if (getLoading(state)) {

        return Promise.resolve('canceled');
    }

    dispatch(loaderOn());

    return new Promise(resolve => {
        setTimeout(() => {

            dispatch(loaderOff());
            resolve('done');
        }, 1000);
    });
}

export const loginSuccess = __JWT_TOKEN__ => ({
    type: LOGIN_SUCCESS,
    payload: __JWT_TOKEN__
});

export const loginError = message => ({
    type: LOGIN_FAILURE,
    payload: {
        message
    }
});

export const loginSignOut = () => ({
    type: LOGIN_SIGNOUT
});

// jwt ^^^

// list
export const FETCH_LIST_REQUEST = 'FETCH_LIST_REQUEST';
export const FETCH_LIST_SUCCESS = 'FETCH_LIST_SUCCESS';
export const FETCH_LIST_FAILURE = 'FETCH_LIST_FAILURE';

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

export const LIST_DELETE_SHOW       = 'LIST_DELETE_SHOW';
export const LIST_DELETE_CANCEL     = 'LIST_DELETE_CANCEL';
export const LIST_DELETE_DELETE     = 'LIST_DELETE_DELETE';

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

