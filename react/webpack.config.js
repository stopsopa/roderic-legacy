'use strict';

const path      = require('path');
const webpack   = require('webpack');
const utils     = require(path.resolve(".", "webpack", "utils"));
const log       = require(path.resolve(".", "webpack", 'log'))
const env       = utils.setup(path.resolve('.', 'config.js'));

/**
 * node_modules\.bin\webpack --config webpack.config.js
 */
module.exports = {
    // entry: Object.assign(utils.entry(), {
    //     vendor: 'moment'
    // }),
    entry: utils.entries(),
    // output: {
    //     filename: 'bundle.js',
    //     path: path.resolve(__dirname, '..', 'dist')
    // },
    output: {
        path: utils.config.js.output,
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

    resolve: {
        modules: utils.config.roots
    },
    module: {
        exprContextCritical: false, // remove error "Critical dependency: the request of a dependency is an expression" https://github.com/AngularClass/angular-starter/issues/993
        // rules: [
        //
        // ]
    },
    plugins: [
        // new UglifyJsPlugin({sourceMap: true}) // https://webpack.js.org/guides/migrating/#uglifyjsplugin-sourcemap
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     minChunks: function (module) {
        //         // this assumes your vendor imports exist in the node_modules directory
        //         return module.context && module.context.indexOf('node_modules') !== -1;
        //     }
        // }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor' // Specify the common bundle's name.
        })
    ]
};