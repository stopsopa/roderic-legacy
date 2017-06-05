'use strict';

const path      = require('path');
const utils     = require("./webpack/utils");

var env = utils.setup(path.resolve('./config.js'));

/**
 * node_modules\.bin\webpack --config webpack.config.js
 */
module.exports = {
    entry: utils.entry(),
    // output: {
    //     filename: 'bundle.js',
    //     path: path.resolve(__dirname, '..', 'dist')
    // },
    output: {
        path: utils.con('js.output'),
        filename: "[name].bundle.js",
        // publicPath: "/publicPath/"
        // chunkFilename: "[id].chunk.js",
        // sourceMapFilename: "[file].map"
    },
    // modules: [
    //     // path.join(__dirname, "src"),
    //     "node_modules"
    // ],
    // extensions: ['', '.js', '.jsx'],

    // module: {
    //     rules: [
    //
    //     ]
    // },
    // plugins: [
    //     new UglifyJsPlugin({sourceMap: true}) // https://webpack.js.org/guides/migrating/#uglifyjsplugin-sourcemap
    // ]
};