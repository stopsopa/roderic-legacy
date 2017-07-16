'use strict';

const path      = require('path');
const webpack   = require('webpack');
const utils     = require(path.resolve(__dirname, "..", "..", "react", "webpack", "utils"));
const log       = require(path.resolve(__dirname, "..", "..", "react", "webpack", 'logn'))
const env       = utils.setup(path.resolve('.', 'config.js'));
const ExtractTextPlugin = require("extract-text-webpack-plugin");

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
        new ExtractTextPlugin("[name].css"),
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
