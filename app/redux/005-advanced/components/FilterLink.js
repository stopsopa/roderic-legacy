
import React from 'react';
import { connect } from 'react-redux';

import Link from './Link';

// https://egghead.io/lessons/javascript-redux-generating-containers-with-connect-from-react-redux-footerlink
const FilterLink = connect(
    (state, props) => {
        return {
            active: props.filter ===  state.visibilityFilter
        }
    },
    (dispatch, props) => {
        return {
            onClick: () => dispatch({
                type: 'SET_VISIBILITY_FILTER',
                filter: props.filter
            })
        };
    }
)(Link);

export default FilterLink;