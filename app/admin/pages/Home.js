import React, { Component } from 'react';

import { connect } from 'react-redux';

import AdvisorsContainer from '../components/home/advisors/AdvisorsContainer';
import CommunityContainer from '../components/home/community/CommunityContainer';
import AgileContainer from '../components/home/agile/AgileContainer';
import IndependentContainer from '../components/home/independent/IndependentContainer';
import IntroContainer from '../components/home/intro/IntroContainer';
import PartnersContainer from '../components/home/partners/PartnersContainer';
import OpenContainer from '../components/home/open/OpenContainer';
import CurrentContainer from '../components/home/current/CurrentContainer';
import PartnershipsContainer from '../components/home/partnerships/PartnershipsContainer';
import InstafeedContainer from '../components/home/instafeed/InstafeedContainer';
import Advisorspartners from '../components/home/advisorspartners/Advisorspartners';

import {
    getHomeIntro
} from '../_redux/reducers';

import {
    homeIntroRequest,
    homeCommunityRequest,
    homeIndependentRequest,
    homeCurrentRequest,
    homePartnershipsRequest,
    homeAgileRequest,
    homeAdvisorsRequest,
    homePartnersRequest,
    homeOpenRequest,
} from '../_redux/actions';

import * as actions from '../_redux/actions';

import commonFetch from '../commonFetch';

class Home extends Component {
    static fetchData = (store, routerParams) => {
        return Promise.all([
            store.dispatch(homeIntroRequest()),
            store.dispatch(homeCommunityRequest()),
            store.dispatch(homeIndependentRequest()),
            store.dispatch(homeCurrentRequest()),
            store.dispatch(homePartnershipsRequest()),
            store.dispatch(homeAgileRequest()),
            store.dispatch(homeAdvisorsRequest()),
            store.dispatch(homePartnersRequest()),
            store.dispatch(homeOpenRequest()),

            commonFetch(store, routerParams)
        ]);
    }
    getData = () => {
        this.props.homeIntroRequest();
        this.props.homeCommunityRequest();
        this.props.homeIndependentRequest();
        this.props.homeCurrentRequest();
        this.props.homePartnershipsRequest();
        this.props.homeAgileRequest();
        this.props.homeAdvisorsRequest();
        this.props.homePartnersRequest();
        this.props.homeOpenRequest();

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
                <IntroContainer />
                <CommunityContainer />
                <IndependentContainer />
                <CurrentContainer />
                <PartnershipsContainer />
                <AgileContainer />
                <Advisorspartners />
                <InstafeedContainer />
            </div>
        )
    }
}

export default connect(
    state => ({
        isPopulated: !!getHomeIntro(state).headline
    }),
    actions
)(Home)