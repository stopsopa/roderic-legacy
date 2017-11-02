
import React from 'react';

import {
    Button,
    Container,
    Header,
    List,
    Label,
    Menu,
    Icon
} from 'semantic-ui-react';

import { NavLink } from 'react-router-dom';

const Navi = ({
    on,
    loaderOn,
    loaderOff,
    loaderError,
    loaderMessage,
    buttonsVisible
}) => (
    <div className="navi">
        {/*<Menu pointing secondary vertical size="small">*/}
            {/*<NavLink to="/gui" activeClassName="active" exact>*/}
                {/*<Menu.Item>*/}
                    {/*Home*/}
                {/*</Menu.Item>*/}
            {/*</NavLink>*/}
            {/*<NavLink to="/gui/create" activeClassName="active">*/}
                {/*<Menu.Item>*/}
                    {/*Create*/}
                {/*</Menu.Item>*/}
            {/*</NavLink>*/}
        {/*</Menu>*/}

        {buttonsVisible &&
            <Button.Group size="mini">
                <Button
                    size='mini'
                    onClick={loaderOn}
                    disabled={on === 'on'}
                >on</Button>
                <Button
                    size='mini'
                    color="red"
                    onClick={() => loaderError("Server error example ...")}
                    disabled={on === 'on'}
                >err</Button>
                <Button
                    size='mini'
                    color="green"
                    onClick={() => loaderMessage("Example message ...")}
                    disabled={on === 'on'}
                >msg</Button>
                <Button
                    size='mini'
                    onClick={loaderOff}
                    disabled={on === 'off'}
                >off</Button>
            </Button.Group>
        }
    </div>
);

export default Navi;