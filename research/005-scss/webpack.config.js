'use strict';

const path                  = require('path');
const webpack               = require('webpack');
const utils                 = require(path.resolve('webpack', "utils"));
const env                   = utils.setup(path.resolve('config.js'));
const ExtractTextPlugin     = require("extract-text-webpack-plugin");
const CleanWebpackPlugin    = require('clean-webpack-plugin');
const UglifyJSPlugin        = require('uglifyjs-webpack-plugin');

var node_modules = path.join(__dirname, 'public', 'public');

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
                        loader: "style-loader",
                        options: {
                            sourceMap: utils.prod,
                        }
                    },
                    use: [
                        {
                            loader: 'css-loader',
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
                            loader: 'sass-loader',
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
                        loader: "style-loader",
                        options: {
                            sourceMap: utils.prod,
                        }
                    },
                    use: [
                        {
                            loader: 'css-loader',
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
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            path.resolve(__dirname, 'node_modules', 'babel-preset-env'),
                            path.resolve(__dirname, 'node_modules', 'babel-preset-es2015'),
                            path.resolve(__dirname, 'node_modules', 'babel-preset-react'),
                            path.resolve(__dirname, 'node_modules', 'babel-preset-stage-0')
                        ],
                        plugins: [
                            path.resolve(__dirname, 'node_modules', 'babel-plugin-transform-decorators-legacy'),
                        ]
                    }
                }
            },
            {
                test: /\.(jpe?g|gif|png|eot|woff2?|ttf|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: { // https://github.com/webpack-contrib/file-loader/tree/docs
                        emitFile: false,
                        name: '[path][name].[ext]',
                        publicPath: '/',
                        context: utils.config.web,
                        useRelativePath: false
                    }
                }

            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([utils.config.js.output]),
        new ExtractTextPlugin("[name].css"),
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
