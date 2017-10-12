'use strict';

import React from 'react';

import range from 'lodash/range';

import {
    Button,
    Container,
    Header,
    List
} from 'semantic-ui-react'

import './index.scss';

export default class Index extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="navi">
                    menu
                </div>
                <div className="content">
                    <List divided relaxed>
                        {range(1,10).map((i) => {
                            return <List.Item key={i}>
                                <List.Icon name="feed" verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Header</List.Header>
                                    <List.Description>Description</List.Description>
                                </List.Content>
                            </List.Item>
                        })}
                    </List>
                </div>
            </div>
        );
    }
}


