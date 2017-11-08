
import React, { Component } from 'react';

import MainList from './MainList';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import * as actions from '../actions';

import {
    getLoaderStatus,
    getList,
    getDelElement
} from '../reducers';

class MainListVisible extends Component {
    static propTypes = {
        on: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool
        ]).isRequired,
        list: PropTypes.array.isRequired,
        del: PropTypes.any
    }
    static fetchData = (store, routerParams) => {

        // log('MainListVisible::fetchData()');

        return Promise.all([
            store.dispatch(actions.fetchList()),
            store.dispatch(actions.nestedLoad(`other then router component`))
        ]);
    }
    componentDidMount() {

        const { list } = this.props;

        (list && list.length) || this.getData();
    }
    // componentDidUpdate(prevProps) {
    //     log('componentDidUpdate');
    //     // this.getData();
    // }
    // componentWillUnmount() {
    //     log('componentWillUnmount');
    // }
    getData = () => {

        const { fetchList } = this.props;

        return fetchList();
    }
    render() {
        return (
            <MainList {...this.props} />
        );
    }
}

const mapStateToProps = state => ({
    on      : getLoaderStatus(state),
    list    : getList(state),
    del     : getDelElement(state)
});

export default connect(
    mapStateToProps,
    actions
)(MainListVisible);