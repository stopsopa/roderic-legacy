<a href="https://stopsopa.github.io/roderic">
    <img src="https://stopsopa.github.io/roderic/logo.svg" alt="Roderic logo"
         title="Roderic" align="right" width="82" height="82"/>
</a>

Roderic
======

[![Build Status](https://travis-ci.org/stopsopa/roderic.svg?branch=redux)](https://travis-ci.org/stopsopa/roderic)

Another Webpack boilderplate. Main goals: 

1) simple as possible (brutally simple and this is priority number one), 
2) yet with maximal configuration flexibility

Don't feel overwhelmed by all files above, their all are there mainly for testing. I still promise that this configuration is simple.

installation:
-
 
 Follow instructions for all [releases](https://github.com/stopsopa/roderic/releases).
    
        
then go to **react** folder configure **config.js** and run one of:
    
    npm run dev
    npm run prod
    
or

    yarn dev
    yarn prod
    
    
Syntax templates
-
- [es6](https://github.com/stopsopa/roderic/blob/master/template.es6.js)
- [redux](https://github.com/stopsopa/roderic/blob/redux/app/redux/004-counters/redux-counters.entry.js)
    
Features
-
- npm run dev
- npm run prod
- tests
- resolving urls in css/scss to jpe?g|gif|png|eot|woff2?|ttf|svg
- installator
- ExtractTextPlugin - extracting css to separate css file
- babel es2015, react, stage-0 presets, decorators-legacy
- integrated plugins ProvidePlugin, UglifyJSPlugin, CleanWebpackPlugin
