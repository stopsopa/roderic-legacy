
import React from 'react';
import { connect } from 'react-redux';
// import Link from './Link';
import classnames from 'classnames';

import { Link, NavLink } from 'react-router-dom';

const FilterLink = function ({ filter, children, match }) {
    return (
        <NavLink
            to={ window.path + ((filter === 'all') ? '' : filter) }
            exact
            activeClassName="active-link"
        >
            {children}
        </NavLink>
    );
}

// https://egghead.io/lessons/javascript-redux-generating-containers-with-connect-from-react-redux-footerlink
// const FilterLink = connect(
//     (state, props) => {
//         return {
//             active: props.filter === state.visibilityFilter
//         }
//     },
//     (dispatch, props) => {
//         return {
//             onClick: () => dispatch({
//                 type: 'SET_VISIBILITY_FILTER',
//                 filter: props.filter
//             })
//         };
//     }
// )(FilterLink);

export default FilterLink;