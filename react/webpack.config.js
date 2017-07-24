'use strict';

const path                  = require('path');
const webpack               = require('webpack');
const utils                 = require(path.resolve('webpack', "utils"));
const env                   = utils.setup(path.resolve('config.js'));
const ExtractTextPlugin     = require("extract-text-webpack-plugin");
const CleanWebpackPlugin    = require('clean-webpack-plugin');
const UglifyJSPlugin        = require('uglifyjs-webpack-plugin');
// const log                   = require(path.resolve('webpack', 'logn'));

var node_modules = path.join(__dirname, 'public', 'public');

console.log('-'.repeat(30), (path.relative(utils.config.js.output, utils.config.js.linked) + path.sep).replace(/\\/g, '/'), '-'.repeat(30));

// console.log(process.env.NODE_PATH)
//
// process.exit(0);

var config = {
    entry: utils.entries(),
    output: {
        path: utils.config.js.output,
        filename: "[name].bundle.js",
    },
    resolve: {
        modules: utils.config.roots,
        extensions: ['.js', '.jsx', '.json'],
        symlinks: false // to properly resolve url() in css/scss thrugh web symlink
    },
    module: {
        rules: [
            {
                // https://webpack.js.org/loaders/style-loader/
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: {
                        loader: path.resolve(node_modules, 'style-loader'),
                        options: {
                            sourceMap: utils.prod,
                        }
                    },
                    use: [
                        {
                            loader: path.resolve(node_modules, 'css-loader'),
                            options: {
                                minimize: utils.prod,
                                sourceMap: utils.prod,
                                //modules: true // more power? : https://github.com/css-modules/css-modules
                                //         // root: utils.config.web,
                                //         // https://stackoverflow.com/questions/41306822/webpack-url-file-loader-is-not-resolving-the-relative-path-of-url/41758240#41758240
                                //         // alias: { // https://webpack.js.org/loaders/css-loader/#alias
                                //         //     "img": "/app/style/img/"
                                //         // }
                            }
                        },
                        {
                            loader: path.resolve(node_modules, 'sass-loader'),
                            options: {
                                sourceMap: utils.prod
                            }
                        }
                        // 'resolve-url-loader'
                    ]
                }),
            },
            {
                // https://webpack.js.org/loaders/style-loader/
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: {
                        loader: path.resolve(node_modules, 'style-loader'),
                        options: {
                            sourceMap: utils.prod,
                        }
                    },
                    use: [
                        {
                            loader: path.resolve(node_modules, 'css-loader'),
                            options: {
                                minimize: utils.prod,
                                sourceMap: utils.prod,
                                //modules: true // more power? : https://github.com/css-modules/css-modules
                                //         // root: utils.config.web,
                                //         // https://stackoverflow.com/questions/41306822/webpack-url-file-loader-is-not-resolving-the-relative-path-of-url/41758240#41758240
                                //         // alias: { // https://webpack.js.org/loaders/css-loader/#alias
                                //         //     "img": "/app/style/img/"
                                //         // }
                            }
                        },
                        // 'resolve-url-loader'
                    ]
                }),
            },
            {
                // https://babeljs.io/docs/plugins/transform-object-rest-spread/
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: path.resolve(node_modules, 'babel-loader'),
                    options: {
                        presets: [
                            path.resolve(node_modules, 'babel-preset-env'),
                            path.resolve(node_modules, 'babel-preset-es2015'),
                            path.resolve(node_modules, 'babel-preset-react'),
                            path.resolve(node_modules, 'babel-preset-stage-0')
                        ],
                        plugins: [
                            path.resolve(node_modules, 'babel-plugin-transform-decorators-legacy'),
                        ]
                    }
                }
            },
            {
                test: /\.(jpe?g|gif|png|eot|woff2?|ttf|svg)$/,
                // loader: 'file-loader?emitFile=false&name=[path][name].[ext]',
                use: {
                    loader: path.resolve(node_modules, 'file-loader'),
                    options: {
                        emitFile: false,
                        name: '[path][name].[ext]',
                        // useRelativePath: true,
                        // publicPath: '/',
                        // relative path from "dist" to main dir with webpack.config.js
                        outputPath: (path.relative(utils.config.js.output, utils.config.js.linked) + path.sep).replace(/\\/g, '/')
                    }
                }

            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([utils.config.js.output]),
        new ExtractTextPlugin("[name].bundle.css"),
    ]
};

if (utils.config.alias && Object.keys(utils.config.alias).length) {
    config.resolve.alias = utils.config.alias;
}

if (utils.config.provide && Object.keys(utils.config.provide).length) { // https://webpack.js.org/plugins/provide-plugin/
    config.plugins.push(new webpack.ProvidePlugin(utils.config.provide));
}

if (utils.prod) {

    // https://webpack.js.org/configuration/devtool/
    // http://cheng.logdown.com/posts/2016/03/25/679045
    // devtool: "eval-source-mahhp"
    // devtool: "cheap-eval-source-map"
    config.devtool = "source-map";

    config.plugins.push(new UglifyJSPlugin({
        sourceMap: true
    }));

    config.plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }));
}

module.exports = config;
