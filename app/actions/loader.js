
import {
    LOADER_BUTTONS_SHOW,
    LOADER_BUTTONS_HIDE,
    LOADER_ON,
    LOADER_OFF,
    LOADER_ERROR,
    LOADER_MESSAGE
} from './types';

export const loaderButtonsShow = () => ({ type: LOADER_BUTTONS_SHOW });
export const loaderButtonsHide = () => ({ type: LOADER_BUTTONS_HIDE });

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