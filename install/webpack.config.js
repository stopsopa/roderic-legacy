'use strict';

const path          = require('path');

const node_modules  = path.resolve('node_modules');

module.exports = {
    entry: {
        server: path.resolve(__dirname, 'install.entry.js')
    },
    target: 'node',
    context: __dirname,
    node: {
        __dirname: true,
        __filename: true
    },
    output: {
        path: __dirname,
        filename: "install.js",
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: path.resolve(node_modules, 'babel-loader')
                }
            },
            {  // https://github.com/Reactive-Extensions/RxJS/issues/1117#issuecomment-308210947
                test: /rx\.lite\.aggregates\.js/,
                use: 'imports-loader?define=>false'
            }
        ]
    }
};