/**
 * @author Szymon Działowski
 * @license MIT License (c) copyright 2017-present original author or authors
 * @homepage https://github.com/stopsopa/roderic
 */

'use strict';

const path                  = require('path');
const fs                    = require('fs');
const webpack               = require('webpack');
const utils                 = require(path.resolve('webpack', "utils"));
const ExtractTextPlugin     = require("extract-text-webpack-plugin");
const CleanWebpackPlugin    = require('clean-webpack-plugin');
const UglifyJSPlugin        = require('uglifyjs-webpack-plugin');
const NodeExternals         = require('webpack-node-externals');
// const log                   = require(path.resolve('webpack', 'logn'));
const ReloadServerPlugin    = require('reload-server-webpack-plugin');
require('colors');

const node_modules = path.join(__dirname, 'node_modules');

utils.setup(path.resolve('config.js'));

/**
 * common
 */
const commonRules = [
    {
        // https://babeljs.io/docs/plugins/transform-object-rest-spread/
        test: /\.js$/,
        // exclude: /(node_modules|bower_components)/,
        exclude: (list => {
            const len = list.length;
            let i;
            return p => {

                p = fs.realpathSync(p);

                for ( i = 1 ; i < len ; i += 1 ) {

                    if (p.indexOf(list[i]) > -1) {

                        return true;
                    }
                }

                return false
            };
        })([
            path.sep + 'node_modules' + path.sep,
            path.sep + 'bower_components' + path.sep
        ]),
        use: {
            loader: path.resolve(node_modules, 'babel-loader'),
            options: {
                babelrc: false,
                presets: [
                    path.resolve(node_modules, 'babel-preset-env'),
                    path.resolve(node_modules, 'babel-preset-es2015'),
                    path.resolve(node_modules, 'babel-preset-react'),
                    path.resolve(node_modules, 'babel-preset-stage-0')
                ],
                plugins: [
                    path.resolve(node_modules, 'babel-plugin-transform-decorators-legacy'),
                ],
                sourceMap: utils.prod
            }
        }
    },
    {
        test: /\.(jpe?g|gif|png|eot|woff2?|ttf|svg)$/,
        // loader: 'file-loader?emitFile=false&name=[path][name].[ext]',
        use: {
            loader: path.resolve(node_modules, 'file-loader'),
            options: { // https://github.com/webpack-contrib/file-loader/tree/docs
                emitFile: false,
                name: '[path][name].[ext]',
                publicPath: '/',
                context: utils.config.web,
                useRelativePath: false,
                sourceMap: utils.prod
            }
        }

    }
];

const resolve = {
    modules: utils.symlink(utils.config.resolve, false, true),
    extensions: ['.js', '.jsx', '.json'],
    symlinks: false // to properly resolve url() in css/scss through web symlink
};

/**
 * web
 */
const web = {
    name: `[ ${utils.config.name} ]`.blue + ` browser bundling`.yellow,
    entry: utils.entries(),
    context: __dirname,
    output: {
        path: utils.config.js.outputForWeb,
        filename: "[name].bundle.js",
    },
    resolve: Object.assign({}, resolve),
    devtool: false,
    module: {
        rules: [
            ...commonRules,
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
                            }
                        },
                        {
                            loader: path.resolve(node_modules, 'sass-loader'),
                            options: {
                                sourceMap: utils.prod
                            }
                        }
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
                            }
                        }
                    ]
                }),
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([utils.config.js.outputForWeb], {
            root: utils.config.root
        }),
        new ExtractTextPlugin("[name].bundle.css"),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(utils.prod ? 'production' : 'development')
            }
        })
    ]
};
if (utils.config.provideForWeb && Object.keys(utils.config.provideForWeb).length) { // https://webpack.js.org/plugins/provide-plugin/

    web.plugins.push(new webpack.ProvidePlugin(utils.config.provideForWeb));
}
if (utils.prod) {

    // https://webpack.js.org/configuration/devtool/
    // http://cheng.logdown.com/posts/2016/03/25/679045
    // devtool: "eval-source-mahhp"
    // devtool: "cheap-eval-source-map"
    web.devtool = "source-map";

    web.plugins.push(new UglifyJSPlugin({
        sourceMap: true,
        parallel: true
    }));
}

if (utils.config.aliasForWeb && Object.keys(utils.config.aliasForWeb).length) {

    web.resolve.alias = utils.config.aliasForWeb;
}

const webpackConfigsList = [web];

const serverEndpoints = utils.entries("/**/*.server.{js,jsx}", true);

if (Object.keys(serverEndpoints).length) {

    /**
     * server
     */
    const server = {
        name: `[ ${utils.config.name} ]`.blue + ` server-side rendering`.yellow,
        entry: serverEndpoints,
        target: 'node',
        context: __dirname,
        node: {
            // https://github.com/webpack/webpack/issues/1599
            __dirname: true,
            __filename: true
        },
        externals: [
            NodeExternals({
                modulesDir: node_modules // https://www.npmjs.com/package/webpack-node-externals#optionsmodulesdir-node_modules
            })
        ],
        output: {
            path: utils.config.js.outputForServer,
            filename: "[name].js",
            libraryTarget: 'commonjs2'
        },
        resolve : {
            alias: {
                log: path.resolve(__dirname, 'webpack', 'logn')
            }
        },
        devtool: false,
        module: {
            rules: [
                ...commonRules,
                {
                    // https://webpack.js.org/loaders/style-loader/
                    test: /\.s?css$/,
                    loader: path.resolve(node_modules, 'css-loader/locals')
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(utils.prod ? 'production' : 'development')
                }
            }),
            new webpack.ProvidePlugin({
                log: 'log'
            })
        ]
    }

    if (utils.config.externalsForServer && utils.config.externalsForServer.length) {

        server.externals.push((context, request, callback, tmp) => {

            //context /Users/sd/Workspace/projects/z_ping-webgui/runtime/public_html/app
            //request ./server.config

            if ( utils.config.externalsForServer.indexOf(tmp = path.resolve(context, request + '.js')) > -1 ) {

                return callback(null, 'commonjs2 .' + path.sep + path.relative(utils.config.js.outputForServer, tmp));
            }

            callback();
        });
    }

    if ( (process.argv.indexOf('--watch') > -1) && utils.config.server && utils.config.server.watchAndReload) {

        server.plugins.push(new ReloadServerPlugin({
            script: utils.config.server.watchAndReload,
        }));
    }

    webpackConfigsList.push(server);
}
else {

    console.log("Server side webpack config ignored - *.server.js not found\n".red);
}

module.exports = webpackConfigsList;

// // https://nodejs.org/docs/latest/api/all.html#modules_accessing_the_main_module
if (require.main === module) {
    // direct

    console.log('Mounting symlinks:');

    console.log("\n    assets:");

    utils.symlink(utils.config.asset, true);

    console.log("\n    resolver:");

    utils.symlink(utils.config.resolve);
}
