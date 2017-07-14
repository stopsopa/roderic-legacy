'use strict';

const path      = require('path');
const webpack   = require('webpack');
const utils     = require(path.resolve(".", "webpack", "utils"));
const log       = require(path.resolve(".", "webpack", 'logn'))
const env       = utils.setup(path.resolve('.', 'config.js'));
// const ExtractTextPlugin = require('extract-text-webpack-plugin');


/**
 * https://webpack.js.org/configuration/
 * migration from webpack 1 : https://webpack.js.org/guides/migrating/
 * node_modules\.bin\webpack --config webpack.config.js
 */
var config = {
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
        // publicPath: "/publicPath/" // https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27
        // chunkFilename: "[id].chunk.js",
        // sourceMapFilename: "[file].map"
    },
    // modules: [
    //     // path.join(__dirname, "src"),
    //     "node_modules"
    // ],
    // extensions: ['', '.js', '.jsx'],

    resolve: {
        modules: utils.config.roots,
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        // exprContextCritical: false, // remove error "Critical dependency: the request of a dependency is an expression" https://github.com/AngularClass/angular-starter/issues/993
        rules: [ // https://webpack.js.org/guides/asset-management/#loading-css
            // {
            //     test: /\.(jpg|png|bmp|gif)$/,
            //     // use: 'url-loader'
            // },
            {
                // https://webpack.js.org/loaders/style-loader/
                test: /\.css$/,
                use:    (false) ?
                    ExtractTextPlugin.extract({ // https://webpack.js.org/loaders/css-loader/#extract
                        // fallback: {
                        //     loader: 'style-loader',
                        //     options: {
                        //         // sourceMap: utils.prod,
                        //         sourceMap: true,
                        //         attrs: {
                        //             class: 'webpack'
                        //         },
                        //         // singleton: true
                        //     }
                        // },
                        // use: [
                        //     // {
                        //     //     loader: 'style-loader',
                        //     //     options: {
                        //     //         // sourceMap: utils.prod,
                        //     //         sourceMap: true,
                        //     //         attrs: {
                        //     //             class: 'webpack'
                        //     //         },
                        //     //         // singleton: true
                        //     //     }
                        //     // },
                        //     {
                        //         loader: 'css-loader',
                        //         options: {
                        //             url: false,
                        //             root: utils.config.web,
                        //             // https://stackoverflow.com/questions/41306822/webpack-url-file-loader-is-not-resolving-the-relative-path-of-url/41758240#41758240
                        //             // alias: { // https://webpack.js.org/loaders/css-loader/#alias
                        //             //     "img/": "/app/style/img/"
                        //             // }
                        //         }
                        //     },
                        //     'resolve-url-loader'
                        // ]
                    })
                    : [
                        {
                            loader: 'style-loader',
                            options: {
                                // sourceMap: utils.prod,
                                sourceMap: true,
                                attrs: {
                                    class: 'webpack'
                                },
                                // singleton: true
                            }
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                                root: utils.config.web,
                                // https://stackoverflow.com/questions/41306822/webpack-url-file-loader-is-not-resolving-the-relative-path-of-url/41758240#41758240
                                alias: { // https://webpack.js.org/loaders/css-loader/#alias
                                    "img": "/app/style/img/"
                                }
                            }
                        },
                        'resolve-url-loader'
                    ]
            },
            {   // https://webpack.js.org/loaders/svg-inline-loader/
                // https://iconmonstr.com/speech-bubble-31/
                test: /\.svg/,
                use: 'svg-inline-loader'
            },
        ]
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
            name: 'common' // Specify the common bundle's name.
        })
    ]
};

if (utils.config.alias) {
    config.resolve.alias = utils.config.alias;
}

if (utils.dev) {

}

// if (utils.prod) {
        // https://webpack.js.org/configuration/devtool/
        // http://cheng.logdown.com/posts/2016/03/25/679045
    // devtool: "eval-source-mahhp"
    // devtool: "cheap-eval-source-map"
    config.devtool = "source-map";

    // config.plugins.push(new ExtractTextPlugin({
    //     filename: '[name].css'
    // }));
// }

module.exports = config;