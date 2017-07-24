'use strict';

const path              = require("path");

const root              = path.resolve(__dirname, '..');

// relative path to public server directory
const web               = path.resolve(root, 'public_html');

const linked            = path.resolve(web, 'linked');

const node_modules      = path.join(__dirname, 'node_modules');

module.exports = {
    web: web,
    resolve: [ // where to search by require and files to watch

        // all custom libraries
        linked,

        { // node_modules exposed on web - symlink mode
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
    },
    provide: { // see format: https://webpack.js.org/plugins/provide-plugin/
        log: 'log'
    },
    js: {
        entries: [ // looks for *.entry.{js|jsx} - watch only on files *.entry.{js|jsx}
            path.resolve(root, 'app'),
            // ...
        ],
        output: path.resolve(web, 'dist'),
    }
}
