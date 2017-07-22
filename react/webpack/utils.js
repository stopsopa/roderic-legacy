'use strict';

var glob      = require("glob");
var path      = require("path");
var colors    = require('colors');

function findentries(root) {
    
    const list = glob.sync(root + "/**/*.entry.{js,jsx}");
    
    let tmp, entries = {};

    for (let i = 0, l = list.length ; i < l ; i += 1) {
        
        tmp = path.parse(list[i]);
        
        tmp = path.basename(tmp.name, path.extname(tmp.name));
        
        entries[tmp] = list[i];
    }
    
    return entries;
}

var utils = {
    config: false,
    setup: function (setup) {

        if (setup && !this.config) {
            
            this.config = require(setup);
        }

        console.log('env: '.yellow + this.env.red + "\n");

        return this.env;
    },
    entries: function () {

        var t, i, tmp = {}, root = this.config.js.entries;

        if (!root) {
            
            throw "First specify root path for entry";
        }

        if (Object.prototype.toString.call( root ) !== '[object Array]') {
            
            root = [root];
        }

        root.forEach(function (r) {

            t = findentries(r);

            for (i in t) {

                if (tmp[i]) {
                    
                    throw "Entry file key '" + i + "' generated from file '" + t[i] + "' already exist";
                }

                tmp[i] = t[i];
            }
        });

        if (!Object.keys(tmp).length) {

            throw "Not found *.entry.js files";
        }

        return tmp;
    }
};

utils.env   = process.env.WEBPACK_MODE || 'dev';

utils.dev   = (utils.env === 'dev');

utils.prod  = !utils.dev;

module.exports = utils;


