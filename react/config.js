'use strict';

const path      = require("path");

// relative path to public server directory
const web           = path.resolve(__dirname, '..', 'public_html');

var node_modules    = path.join(__dirname, 'node_modules');

var linked          = path.resolve(web, 'linked');

var root            = path.resolve(__dirname, '..');

module.exports = {
    web: web,
    resolve: [ // where to search by require and files to watch

        // all custom libraries
        linked,

        { // symlink mode
            path: node_modules,
            link: path.resolve(linked, 'public')
        },
    ],
    linked: [ // just create links, this links are not direct paths for resolver
        {
            path: path.resolve(root, 'app', 'react', 'assets'),
            link: path.resolve(linked, 'rassets')
        },
        {
            path: path.resolve(root, 'dir-to-link'),
            link: path.resolve(linked, 'example')
        },
        {
            path: path.resolve(root, 'app'),
            link: path.resolve(linked, 'app')
        }
    ],
    alias: {
        log: path.resolve(__dirname, 'webpack', 'logw'),
        //     log     : path.resolve('./webpack/log'),
        //
        //     // https://facebook.github.io/react/docs/update.html g(Immutability Helpers)
        //     // https://www.npmjs.com/package/immutability-helper
        //     // https://github.com/seansfkelley/pure-render-decorator/commit/137f8a3c6999aba4688f81ad6c9f4b9f0a180de1
        //     // fbjs/lib/shallowEqual.js somewhere in node_modules from repository 'facebook/fbjs'
        //     // https://github.com/jurassix/react-immutable-render-mixin
        //     update  : 'immutability-helper',
        //     fb: 'fbjs/lib',
    },
    provide: { // see format: https://webpack.js.org/plugins/provide-plugin/
        log: 'log'
    },
    js: {
        entries: [ // looks for *.entry.{js|jsx} - watch only on files *.entry.{js|jsx}
            path.resolve(__dirname, '..', 'app'),
            // ...
        ],
        output: path.resolve(web, 'dist'),
    }
}
