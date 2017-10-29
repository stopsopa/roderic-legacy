
import React from 'react';

import PropTypes from 'prop-types';

import range from 'lodash/range';

import Fp from './FacebookPlaceholder';

import { Motion, TransitionMotion, spring, presets } from 'react-motion';

import {
    Button,
    Container,
    Header,
    List,
    Icon,
    Label,
    Modal,
    Popup
} from 'semantic-ui-react';

import { Link } from 'react-router-dom';

const date = str => {

    const tmp = str.replace(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})\.\d{1,3}\+\d{2}:\d{2}$/, '$1 $2');

    if (str === tmp) {

        return '---';
    }

    return tmp;
}

const MainList = ({ on, list, del, showDelete, cancelDelete, deleteElementFromList }) => {

    if (on === 'on' && ! list.length) {

        return (
            <div>
                <Header as="h1">List of endpoints</Header>
                <List divided relaxed>
                    {
                        range(1, 6).map(
                            i => <List.Item key={i}>
                                <Fp>
                                    <Fp.box className="icon" />
                                    <Fp.p numberOfWords={20} wordLength={5}/>
                                    <Fp.p numberOfWords={5} />
                                </Fp>
                            </List.Item>
                        )
                    }
                </List>
            </div>
        );

    }

    return (
        <Motion
            defaultStyle={{x: 25}}
            style={{x: spring(0)}}
            willEnter={() => ({w: 0, h: 0})} // when dynamically render new element
        >
            {({x}) => (
                <div
                    style={{
                        marginLeft: `${x}px`
                    }}
                >
                    <Header as="h1">List of endpoints</Header>
                    <div className="table">
                        {
                            list.map((item) => (
                                <div className="cell" key={item._id}>
                                    <div className="ico">
                                        <Icon name='feed' />
                                    </div>
                                    <div>
                                        <div className="tico">
                                            <Label
                                                className="right"
                                                size="mini"
                                                color={(item.laststatus == 200) ? 'teal' : 'red' }
                                            >{item.laststatus}</Label>
                                        </div>
                                        <div className="ttop">
                                            <b>Modified:</b> {date(item._modified)}, <b>Created:</b> {date(item._created)}
                                        </div>
                                        <div className="tbottom">
                                            <a href={item.url} target="_blank">{item.url}</a>
                                        </div>
                                    </div>
                                    <div className="actions">
                                        <Button.Group size="mini">
                                            <Link to={`/gui/edit/${item._id}`}>
                                                <Popup
                                                    trigger={
                                                        <Button
                                                            icon='edit'
                                                            size="mini"
                                                            disabled={on === 'on'}
                                                        />
                                                    }
                                                    content='Edit'
                                                    inverted
                                                    size="mini"
                                                    position="top center"
                                                />
                                            </Link>
                                            <Popup
                                                trigger={
                                                    <Button
                                                        color="red"
                                                        icon='trash outline'
                                                        size="mini"
                                                        onClick={() => showDelete(item._id)}
                                                        disabled={on === 'on'}
                                                    />
                                                }
                                                content='Delete'
                                                inverted
                                                size="mini"
                                                position="top center"
                                            />
                                        </Button.Group>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <Modal
                        basic
                        size='small'
                        dimmer="blurring"
                        open={!!del}
                        onClose={cancelDelete}
                    >
                        <Header icon='trash outline' content='Delete endpoint' />
                        <Modal.Content>
                            <p>Do you really want to delete checking endpoint</p>
                            <pre>{del ? del.url : ''}</pre>
                            <p>?</p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button
                                color="red"
                                onClick={() => deleteElementFromList(del._id)}
                            >
                                <Icon name='trash outline' /> Yes
                            </Button>
                            <Button
                                basic
                                color='green'
                                inverted
                                onClick={cancelDelete}
                            >
                                <Icon name='remove' /> No
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </div>
            )}
        </Motion>
    );
};
MainList.propTypes = {
    on: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]).isRequired,
    list: PropTypes.array.isRequired,
    del: PropTypes.any,
    showDelete: PropTypes.func,
    onCancelDelete: PropTypes.func,
    deleteElementFromList: PropTypes.func
};

export default MainList;