
import { combineReducers } from 'redux';

/* imports */

import homeIntro, * as fromHomeIntro from './home/intro';

import homeCommunity, * as fromHomeCommunity from './home/community';

import homeIndependent, * as fromHomeIndependent from './home/independent';

import homeCurrent, * as fromHomeCurrent from './home/current';

import homePartnerships, * as fromHomePartnerships from './home/partnerships';

import homeAgile, * as fromHomeAgile from './home/agile';

import homeAdvisors, * as fromHomeAdvisors from './home/advisors';

import homePartners, * as fromHomePartners from './home/partners';

import homeOpen, * as fromHomeOpen from './home/open';

import programsPhysician, * as fromProgramsPhysician from './programs/physician';

import programsAwareness, * as fromProgramsAwareness from './programs/awareness';

import programsPatient, * as fromProgramsPatient from './programs/patient';

import programsResearcher, * as fromProgramsResearcher from './programs/researcher';

import footer, * as fromFooter from './footer';

import header, * as fromHeader from './header';

import contactDetails, * as fromContactDetails from './contact/details';
/* imports */

export default combineReducers({
    /* combine */
    homeIntro,
    homeCommunity,
    homeIndependent,
    homeCurrent,
    homePartnerships,
    homeAgile,
    homeAdvisors,
    homePartners,
    homeOpen,
    programsPhysician,
    programsAwareness,
    programsPatient,
    programsResearcher,
    footer,
    header,
    contactDetails,
    /* combine */
});

/* selectors */

export const getHomeIntro = state =>
    fromHomeIntro.getHomeIntro(state.homeIntro)
;

export const getHomeCommunity = state =>
    fromHomeCommunity.getHomeCommunity(state.homeCommunity)
;

export const getHomeIndependent = state =>
    fromHomeIndependent.getHomeIndependent(state.homeIndependent)
;

export const getHomeCurrent = state =>
    fromHomeCurrent.getHomeCurrent(state.homeCurrent)
;

export const getHomePartnerships = state =>
    fromHomePartnerships.getHomePartnerships(state.homePartnerships)
;

export const getHomeAgile = state =>
    fromHomeAgile.getHomeAgile(state.homeAgile)
;

export const getHomeAdvisors = state =>
    fromHomeAdvisors.getHomeAdvisors(state.homeAdvisors)
;

export const getHomePartners = state =>
    fromHomePartners.getHomePartners(state.homePartners)
;

export const getHomeOpen = state =>
    fromHomeOpen.getHomeOpen(state.homeOpen)
;

export const getProgramsPhysician = state =>
    fromProgramsPhysician.getProgramsPhysician(state.programsPhysician)
;

export const getProgramsAwareness = state =>
    fromProgramsAwareness.getProgramsAwareness(state.programsAwareness)
;

export const getProgramsPatient = state =>
    fromProgramsPatient.getProgramsPatient(state.programsPatient)
;

export const getProgramsResearcher = state =>
    fromProgramsResearcher.getProgramsResearcher(state.programsResearcher)
;

export const getFooter = state =>
    fromFooter.getFooter(state.footer)
;

export const getHeader = state =>
    fromHeader.getHeader(state.header)
;

export const getContactDetails = state =>
    fromContactDetails.getContactDetails(state.contactDetails)
;
/* selectors */


