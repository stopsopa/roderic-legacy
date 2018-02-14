import React, { Component } from 'react';

import { connect } from 'react-redux';

import ContactDetailsContainer from '../components/contact/contactdetails/ContactDetailsContainer';

import {
    getContactDetails
} from '../_redux/reducers';

import {
    contactDetailsRequest,
} from '../_redux/actions';

import * as actions from '../_redux/actions';

import commonFetch from '../commonFetch';

class Contact extends Component {
    static fetchData = (store, routerParams) => {
        return Promise.all([
            store.dispatch(contactDetailsRequest()),

            commonFetch(store, routerParams)
        ]);
    }
    getData = () => {
        this.props.contactDetailsRequest();

        this.props.headerRequest();
    }
    componentDidMount() {

        const { isPopulated, history: { action } } = this.props;

        (  ( ! isPopulated ) || action === 'PUSH' ) && this.getData();

        try{gtagpageview()}catch(e){console.log('no-gtagpageview')}
    }
    render() {
        return (
            <div>
                <ContactDetailsContainer />
            </div>
        )
    }
}

export default connect(
    state => ({
        isPopulated: !!getContactDetails(state).offices.length
    }),
    actions
)(Contact);
