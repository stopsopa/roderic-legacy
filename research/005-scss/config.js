'use strict';

const path      = require("path");

// relative path to public server directory
const web = path.resolve('..', '..', 'public_html');

module.exports = {
    web: web,
    resolve: [ // where to search by require and files to watch

        // path to linked directory - should be somewhere in 'web' - for css scss and others, can be also for js modules
        path.resolve(web, 'research', '005-scss', 'linked'),

        // must be exposed somewhere in "linked" for publishing images from modules, default "public" dir
        // path.resolve('node_modules'),
        path.resolve(web, 'research', '005-scss', 'linked', 'public'),
    ],
    alias: {
        log: path.resolve('..', '..', 'react', 'webpack', 'logw'),
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
            path.resolve('app'),
            // ...
        ],
        // output: path.resolve(web + '/js')
        output: path.resolve(web, 'research', '005-scss', 'dist')
    }
}
