'use strict';

const path      = require('path');
const webpack   = require('webpack');
const utils     = require(path.resolve(__dirname, "..", "..", "react", "webpack", "utils"));
const log       = require(path.resolve(__dirname, "..", "..", "react", "webpack", 'logn'))
const rmdir     = require(path.resolve(__dirname, "..", "..", "react", "webpack", 'rmdir'))
const env       = utils.setup(path.resolve('.', 'config.js'));
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')

var config = {
    entry: utils.entries(),
    output: {
        path: utils.config.js.output,
        filename: "[name].bundle.js",
    },
    resolve: {
        modules: utils.config.roots,
        extensions: ['.js', '.jsx', '.json'],
        symlinks: false
    },
    module: {
        rules: [
            {
                // https://webpack.js.org/loaders/style-loader/
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            //     options: {
                            //         sourceMap: true,
                            //         url: false,
                            //         // root: utils.config.web,
                            //         // https://stackoverflow.com/questions/41306822/webpack-url-file-loader-is-not-resolving-the-relative-path-of-url/41758240#41758240
                            //         // alias: { // https://webpack.js.org/loaders/css-loader/#alias
                            //         //     "img": "/app/style/img/"
                            //         // }
                            //     }
                        },
                        // 'resolve-url-loader'
                    ]
                }),
                // use:    [
                //     {
                //         loader: 'style-loader',
                //         options: {
                //             sourceMap: true
                //         //     // sourceMap: utils.prod,
                //         //     sourceMap: true,
                //         //     attrs: {
                //         //         class: 'webpack'
                //         //     },
                //         //     // singleton: true
                //         }
                //     },
                //     {
                //         loader: 'css-loader',
                //     //     options: {
                //     //         sourceMap: true,
                //     //         url: false,
                //     //         // root: utils.config.web,
                //     //         // https://stackoverflow.com/questions/41306822/webpack-url-file-loader-is-not-resolving-the-relative-path-of-url/41758240#41758240
                //     //         // alias: { // https://webpack.js.org/loaders/css-loader/#alias
                //     //         //     "img": "/app/style/img/"
                //     //         // }
                //     //     }
                //     },
                //     'resolve-url-loader'
                // ]
            },
            {
                test: /\.(jpe?g|gif|png|eot|woff2?|ttf|svg)$/,
                // loader: 'file-loader?emitFile=false&name=[path][name].[ext]',
                use: {
                    loader: 'file-loader',
                    options: {
                        emitFile: false,
                        name: '[path][name].[ext]',
                        // useRelativePath: true
                        // publicPath: '/',
                        outputPath: '../' // because
                    }
                }

            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([utils.config.js.output]),
        new ExtractTextPlugin("[name].css"),
        // (function () { // https://webpack.js.org/api/plugins/
        //     function MyPlugin(options) {}
        //     MyPlugin.prototype.apply = function(compiler) {
        //         compiler.plugin("compile", function(params) {
        //             console.log('compile '.repeat(5) + "\n\n");
        //             rmdir(utils.config.js.output);
        //             process.exit(0);
        //             // rmdir(utils.config.js.output);
        //         });
        //         // compiler.plugin("compilation", function(params) {
        //         //     console.log('compilation '.repeat(5) + "\n\n");
        //         // });
        //         // compiler.plugin("before-hash", function(params) {
        //         //     console.log('-- before-hash '.repeat(5) + "\n\n");
        //         // });
        //         // compiler.plugin("after-hash", function(params) {
        //         //     console.log('-- after-hash '.repeat(5) + "\n\n");
        //         // });
        //         // compiler.plugin("make", function(params) {
        //         //     console.log('make '.repeat(5) + "\n\n");
        //         // });
        //         // compiler.plugin("context-module-factory", function(params) {
        //         //     console.log('context-module-factory '.repeat(5) + "\n\n");
        //         // });
        //         // compiler.plugin("normal-module-factory", function(params) {
        //         //     console.log('normal-module-factory '.repeat(5) + "\n\n");
        //         // });
        //     };
        //     return new MyPlugin();
        // }())
    ]
};

if (utils.config.alias && Object.keys(utils.config.alias).length) {
    config.resolve.alias = utils.config.alias;
}

if (utils.config.provide && Object.keys(utils.config.provide).length) { // https://webpack.js.org/plugins/provide-plugin/
    config.plugins.push(new webpack.ProvidePlugin(utils.config.provide));
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
