
import React from 'react';

import './GlobalLoader.scss';

import { Segment, Loader, Dimmer } from 'semantic-ui-react'

import classnames from 'classnames';

const GlobalLoader = ({ status, msg }) => {

    if ( status === 'off' ) {

        return null;
    }

    if ( status === 'err' || status === 'msg' ) {

        return (
            <div className={classnames(
                'global-loader-component',
                status
            )}>
                <span>{msg}</span>
            </div>
        );
    }

    return (
        <div className="global-loader-component load">
            <Loader size='mini' active inline />
            <span>Loading ...</span>
        </div>
    );
}


export default GlobalLoader;

