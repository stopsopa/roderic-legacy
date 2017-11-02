
import React, { Component } from 'react';

import styled, { css } from 'styled-components';

import configPublic from '../public.config';

import classnames from 'classnames';

import {
    Button,
    Checkbox,
    Form,
    Header,
    Input,
    Message,
    Icon
} from 'semantic-ui-react'

import './LoginForm.scss';

const Layout = styled.section`
position: absolute;
padding: 10px;
background-color: white;
top: 50%;
left: 50%;
-webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%); 
& > div {
    width: 400px;
} 

@-webkit-keyframes shake {
  0% {
    -webkit-transform: translate(-50%, -50%);
  }
  70% {
    -webkit-transform: translate(-50%, -50%);
  }
  78% {
    -webkit-transform: translate(-53%, -50%);
  }
  85% {
    -webkit-transform: translate(-47%, -50%);
  }
  93% {
    -webkit-transform: translate(-53%, -50%);
  }
  100% {
    -webkit-transform: translate(-50%, -50%);
  }
}
@keyframes shake {
  0% {
    transform: translate(-50%, -50%);
  }
  70% {
    transform: translate(-50%, -50%);
  }
  78% {
    transform: translate(-53%, -50%);
  }
  85% {
    transform: translate(-47%, -50%);
  }
  93% {
    transform: translate(-53%, -50%);
  }
  100% {
    transform: translate(-50%, -50%);
  }
}

&.shake {
    -webkit-animation: shake 1.3s;
    animation: shake 1.3s;
}
`;


export default class LoginForm extends Component {
    static fetchData = (store, routerParams) => {
        return Promise.resolve();
    }
    constructor(...args) {
        super(...args);

        this.state = {
            password: '',
            username: '',
            action: configPublic.jwt.loginUrl
        };
    }
    componentDidMount() {
        document.body.classList.add('login-form');
        log('props', this.props);
    }
    componentWillUnmount() {
        document.body.classList.remove('login-form');
    }
    onSubmit = e => {

        e.preventDefault();

        const {
            loginRequest
        } = this.props;

        loginRequest(this.state.username, this.state.password);
    }
    onChange = (e, name) => this.setState({[name]:e.target.value});
    render = () => {

        const {
            loading,
            error,
            redirectAfterAuthenticated,
            authenticated,
            loginRequest
        } = this.props;

        let content = null;

        if (authenticated) {

            content = this.props.children || (
                <div>
                    <Button size="tiny" onClick={this.props.onSignOut}>
                        <Icon name="log out" /> Sign out
                    </Button>
                </div>
            );
        }
        else {

            content = (

                <div>
                    <Header as="h2">Log-in to your account.</Header>
                    <div>
                        <Form
                            action={this.state.action}
                            size="mini"
                            disabled={loading}
                            method="POST"
                        >
                            <Form.Field>
                                <label htmlFor="username">First Name</label>
                                {/* https://stackoverflow.com/a/37601110/5560682 */}
                                <Input
                                    name="username"
                                    placeholder="Username"
                                    autoComplete="username"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    required
                                    loading={loading}
                                    disabled={loading}
                                    icon="user"
                                    iconPosition="left"
                                    onChange={e => this.onChange(e, 'username')}
                                    error={!!error}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="password">Password</label>
                                <Input
                                    ref={input => this.password = input}
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="password"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    required
                                    loading={loading}
                                    disabled={loading}
                                    icon="lock"
                                    iconPosition="left"
                                    onChange={e => this.onChange(e, 'password')}
                                    error={!!error}
                                />
                            </Form.Field>
                            {error &&
                            <Message
                                negative
                                size="tiny"
                                color="red"
                            >
                                <Icon name="warning sign" />
                                {error}
                            </Message>
                            }
                            <Button
                                type="submit"
                                size="mini"
                                primary={!loading}
                                disabled={loading}
                            >Login</Button>
                            <input
                                type="hidden"
                                name={configPublic.jwt.loginHiddenInput.name}
                                value={configPublic.jwt.loginHiddenInput.value}
                            />
                        </Form>
                    </div>
                </div>
            );
        }

        return (
            <Layout className={classnames({'shake': !!error})}>
                {content}
            </Layout>
        );
    };
};