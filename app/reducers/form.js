
import { combineReducers } from 'redux';

import {
    FORM_ITEM_INTERVAL_CHANGE,
    FORM_ITEM_INTERVAL_RESET,
    FORM_ITEM_STATUS_CHANGE,
    FORM_ITEM_STATUS_RESET,
    FORM_ITEM_URL_CHANGE,
    FORM_ITEM_URL_RESET,
    FORM_ITEM_FETCH_SUCCESS
} from '../actions';

const laststatus = ((def) => (state = def, action) => {
    switch (action.type) {
        case FORM_ITEM_STATUS_CHANGE:
            return parseInt(action.value, 10) || 0;
        case FORM_ITEM_FETCH_SUCCESS:
            return action.data.laststatus;
        case FORM_ITEM_STATUS_RESET:
            return def;
        default:
            return state;
    }
})(0);

const interval = ((def) => (state = def, action) => {
    switch (action.type) {
        case FORM_ITEM_INTERVAL_CHANGE:
            return parseInt(action.value, 10) || 1;
        case FORM_ITEM_FETCH_SUCCESS:
            return action.data.interval;
        case FORM_ITEM_INTERVAL_RESET:
            return def;
        default:
            return state;
    }
})(1);

const url = ((def) => (state = def, action) => {
    switch (action.type) {
        case FORM_ITEM_URL_CHANGE:
            return action.value;
        case FORM_ITEM_FETCH_SUCCESS:
            return action.data.url;
        case FORM_ITEM_URL_RESET:
            return def;
        default:
            return state;
    }
})('http://');

export default combineReducers({
    laststatus,
    interval,
    url
});

export const getStatus      = state => state.status;
export const getInterval    = state => state.interval;
export const getUrl         = state => state.url;

export const getValue = (state, key) => state[key];