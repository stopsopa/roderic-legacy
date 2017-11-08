/**
 * @author Szymon Działowski
 * @license MIT License (c) copyright 2017-present original author or authors
 * @homepage https://github.com/stopsopa/roderic
 */

'use strict';

const path              = require("path");

const webpack           = __dirname;

const root              = path.resolve(webpack, '..');

// relative path to public server directory
const web               = path.resolve(root, 'docs');

const asset             = path.resolve(web, 'asset');

const node_modules      = path.join(webpack, 'node_modules');

const app               = path.resolve(root, 'app');

module.exports = {
    // just name for this project, it's gonna show up in some places
    name: 'webpack-demo',
    root: root,
    web: web,
    app: app,
    webpack: webpack,
    resolve: [ // where to search by require and files to watch

        // all custom libraries
        asset,

        { // node_modules exposed on web - symlink mode
            path: node_modules,
            link: path.resolve(asset, 'public')
        }
    ],
    asset: [ // just create links, this links are not direct paths for resolver
        {
            path: path.resolve(root, 'app', 'other', 'react', 'assets'),
            link: path.resolve(asset, 'rassets')
        },
        {
            path: path.resolve(root, 'dir-to-link'),
            link: path.resolve(asset, 'example')
        },
        {
            path: path.resolve(root, 'app'),
            link: path.resolve(asset, 'app')
        }
    ],
    aliasForWeb: {
        log         : path.resolve(webpack, 'webpack', 'logw'),
        transport   : path.resolve(app, 'transport')
    },
    provideForWeb: { // see format: https://webpack.js.org/plugins/provide-plugin/
        log: 'log'
    },
    js: {
        entries: [ // looks for *.entry.{js|jsx} - watch only on files *.entry.{js|jsx}
            app,
            // ...
        ],
        outputForWeb    : path.resolve(web, 'dist'),
        outputForServer : path.resolve(webpack, 'servers')
    },
    externalsForServer: [
        path.resolve(app, 'server.config.js'),
        path.resolve(app, 'public.config.js'),
        path.resolve(webpack, 'config.js')
    ],
    server: {
        host: '0.0.0.0',
        port: 1025,
        watchAndReload: path.resolve(webpack, 'servers', 'index.js')
    }
}
