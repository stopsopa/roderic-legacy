'use strict';

import path from 'path';

import fs from 'fs';

import React from 'react';

import serialize from 'serialize-javascript';

import express from 'express';

import jwt from 'jsonwebtoken'

import compression from 'compression';

import bodyParser from 'body-parser';

import configWebpack from '../:react::react_dir:/config';

import configPublic from './public.config';

import configServer from './server.config';

import RootServer from './components/RootServer';

import configureStore, { fetchData } from './configureStore';

import 'colors';

import { renderToString } from 'react-dom/server';

import sourceMapSupport from "source-map-support";

import favicon          from 'serve-favicon';

import template from 'lodash/template';

import { ServerStyleSheet } from 'styled-components'

import proxy from 'http-proxy-middleware';

import trimEnd from 'lodash/trimEnd';

const isObject = a => (!!a) && (a.constructor === Object);

// import { loginSuccess } from './_redux/actions';

if (process.env.NODE_ENV === 'development') {

    sourceMapSupport.install();
}

const host      = configWebpack.server.host;
const port      = configWebpack.server.port;

process.on('uncaughtException', function (e) {
    switch (true) {
        case (e.code === 'EADDRINUSE' && e.errno === 'EADDRINUSE'):
            process.stdout.write(`\naddress ${host}:${port} already in use - server killed\n\n`.red);
            break;
        case (e.code === 'EACCES' && e.errno === 'EACCES'):
            process.stdout.write(`\nno access to take ${host}:${port} address - server killed - (use sudo)\n\n`.red);
            break;
        default:
            throw e;
    }
});

const app = express();

app.use(compression({filter: (req, res) => {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
}}));

if (configServer.php_proxy) {

    (function (c) {

        const prefix = trimEnd(c.prefix, '/');

        if (prefix && c.schema && c.host && c.port) {

            app.use(
                c.prefix,
                proxy(
                    [c.schema,'://',c.host,':',c.port].join(''),
                    {
                        changeOrigin: true,
                        pathRewrite: (path, req) => path.substring(prefix.length)
                    }
                )
            );

        }
        else {
            throw "configServer schema, prefix, host or port is wrong/missing";
        }

    }(configServer.php_proxy));
}
app.use(favicon(path.resolve(configWebpack.web, 'favicon.ico')))

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(express.static(configWebpack.web, { // http://expressjs.com/en/resources/middleware/serve-static.html
    // maxAge: 60 * 60 * 24 * 1000 // in milliseconds
    maxAge: '356 days' // in milliseconds
}));

if (configServer.checkAcceptHeader) {

    app.use(require('./libs/checkAcceptHeaderMiddleware'));
}
// login & check token

const headerName = `Authorization`;
app.use((req, res, next) => {

    try {
        if (
            req.body[configPublic.jwt.loginHiddenInput.name]
            === configPublic.jwt.loginHiddenInput.value
        ) {

            const user = configServer.jwt.users.find(user => (
                (user.username === req.body.username)
                &&
                (user.password === req.body.password)
            ));

            if (user) {

                const payload = { // directly for loginSuccess redux action
                    username: user.username
                    // role and other
                };

                const token = jwt.sign(
                    payload,
                    configServer.jwt.secret,
                    {
                        expiresIn: configServer.jwt.tokenExpireAfter
                    }
                );

                if (configPublic.jwt.postToGetReloadShortcut) {

                    if ((req.get('accept') || '').toLowerCase().split(',').indexOf('text/html') > -1) {

                        res.set('Content-Type', 'text/html');

                        return res.end(`<script>try{localStorage.setItem('${configPublic.jwt.localStorageKey}','${token}');location.href = location.href;}catch(e){document.write = "Error: Can't create localstorage session...";}</script>`);
                    }
                }

                // res.setHeader(headerName, `Bearer ${token}`);

                // building __JWT_TOKEN__
                // to hydrate loginSuccess redux action
                res[headerName] = token;
            }
            else {

                // invalid credentials, in other words: login failed
                res[headerName] = false;
            }
        }
    }
    catch (e) {

        log('JWT login error', e);
    }

    // res.set('X-test', 'testvaluse');
    //
    // console.log('baseUrl', req.baseUrl);
    // console.log('url', req.url);
    // console.log('originalUrl', req.originalUrl);

    next();
});

const htmlLazyLoaderTemplate = require('./libs/fileLazyLoader')(path.resolve(configWebpack.app, 'index.server.html'), 30, (content, file) => {

    let tmp;

    try {
        tmp = template(content);
    }
    catch (e) {

        throw `binding template '${file}' error, probably syntax error`;
    }

    return params => {
        try {
            return tmp(params);
        }
        catch (e) {
            log(`parsing template '${file}' error: `, e);
        }
    }
});

app.use((req, res) => {

    // read later: TTFB https://hackernoon.com/whats-new-with-server-side-rendering-in-react-16-9b0d78585d67#ee91
    // if we want to handle 301 or 404 i you shouldnt use TTFB

    const store = configureStore();

    // data received from authentication middleware
    let data;
    if (res[headerName] !== undefined) {

        data = res[headerName];

        if (data && data.token && data.payload) {

            store.dispatch(loginSuccess(data));
        }
    }

    fetchData(req.url, store).then(() => {

        try {

            const context = {};

            const sheet = new ServerStyleSheet();

            let html = renderToString(sheet.collectStyles(<RootServer
                store={store}
                location={req.url}
                context={context}
            />));

            res.status(context.status || (context.status = 200));

            if (context.status === 301 || context.status === 302) {

                if (context.url) {

                    return res.redirect(context.status, context.url);
                }

                log('context.url not specified');
            }

            // https://www.styled-components.com/docs/advanced#server-side-rendering
            const styleTags = sheet.getStyleTags();

            let scriptWithPayload = '';

            if (data !== undefined) {

                // it's gonna show only on response after post valid request to login
                scriptWithPayload = `<script>window.__JWT_TOKEN__ = ${serialize(data)};</script>`;
            }

            // window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState()).replace(/</g, '\\\\\u003c')};

            const replace = {
                html,
                styleTags,
                // WARNING: See the following for security issues around embedding JSON in HTML:
                // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
                data: `<script>window.__PRELOADED_STATE__ = ${serialize(store.getState())};window.responsestatuscode = ${context.status || 200};</script>${scriptWithPayload}`
            };

            res.send(htmlLazyLoaderTemplate()({
                ...replace,
                ...configServer.htmlParams
            }));
        }
        catch (e) {

            return Promise.reject({
                source: 'SSR error try catch: ',
                e
            });
        }
    })
    .catch(reason => {

            log.start();

            log.dump(reason);

            let error = log.get(true).split("\n");

            // restrict to show full error by ip or other, or just log error
            // logging error would be best idea
            res
                .status(500)
                .set('Content-type', 'application/json; charset=utf-8')
                .send(JSON.stringify({
                    message: 'SSR error: ',
                    error
                }, null, '    '))
            ;
    });
});

app.listen(port, host, () => {

    console.log(`\n 🌎  Server is running `.green + `${host}:${port}\n`.blue)
});


