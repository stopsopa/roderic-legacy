
import {
    HOME_COMMUNITY_REQUEST,
    HOME_COMMUNITY_SUCCESS,
    HOME_COMMUNITY_FAILURE,
} from '../types';

import {
    fetchJson
} from '../../../transport';

export const homeCommunityRequest = () => (dispatch, getState) => {

    dispatch({
        type: HOME_COMMUNITY_REQUEST
    });

    return fetchJson('/api/json/home-community', {
        method: 'post'
    })
        .then(json => {
            dispatch(homeCommunitySuccess(json));
        }, e => {
            dispatch(homeCommunityFailure())
        })
    ;
};

export const homeCommunitySuccess = data => ({
    type: HOME_COMMUNITY_SUCCESS,
    payload: data
});

export const homeCommunityFailure = () => ({
    type: HOME_COMMUNITY_FAILURE
});

