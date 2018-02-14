import React, { Component } from 'react';

import { connect } from 'react-redux';

import AwarenessContainer from '../components/programs/awareness/AwarenessContainer';
import PhysicianContainer from '../components/programs/physician/PhysicianContainer';
import ResearcherContainer from '../components/programs/researcher/ResearcherContainer';
import PatientContainer from '../components/programs/patient/PatientContainer';

import {
    getProgramsPhysician
} from '../_redux/reducers';

import {
    programsPhysicianRequest,
    programsAwarenessRequest,
    programsPatientRequest,
    programsResearcherRequest,
} from '../_redux/actions';

import * as actions from '../_redux/actions';

import commonFetch from '../commonFetch';

class Programs extends Component {
    static fetchData = (store, routerParams) => {
        return Promise.all([
            store.dispatch(programsPhysicianRequest()),
            store.dispatch(programsAwarenessRequest()),
            store.dispatch(programsPatientRequest()),
            store.dispatch(programsResearcherRequest()),

            commonFetch(store, routerParams)
        ]);
    }
    getData = () => {
        this.props.programsPhysicianRequest();
        this.props.programsAwarenessRequest();
        this.props.programsPatientRequest();
        this.props.programsResearcherRequest();

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
                <PhysicianContainer/>
                <AwarenessContainer/>
                <ResearcherContainer/>
                <PatientContainer/>
            </div>
        )
    }
}

export default connect(
    state => ({
        isPopulated: !!getProgramsPhysician(state).headline
    }),
    actions
)(Programs);
