/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1091);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1091:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1092);

var log = __webpack_require__(243);

log('test');

document.addEventListener('DOMContentLoaded', function () {
    log('DOMContentLoaded');
    document.querySelector('#test').innerHTML = 'added in js #test <div class="text" data-test="scss - i will search for this in tests">green</div><div class="png">green</div>';
});

/***/ }),

/***/ 1092:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 243:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/**
 * @author Szymon Działowski
 * @license MIT License (c) copyright 2017-present original author or authors
 * @homepage https://github.com/stopsopa/webpack3
 */


// -- test --- vvv

// (function () {
//
//     (function () {
//
//         console.log('------------ 1');
//
//         log('one')('two')('three');
//
//         console.log('------------ 2');
//
//         log('-test-')('+test+')('testddd')('next');
//
//         console.log('------------ 3');
//
//         log.stack(2)('-test-')('+test+')('testddd')('next');
//
//         console.log('------------ stack default 2');
//
//         log.stack(0)('-test-')('+test+')('testddd')('next');
//
//         console.log('------------ json');
//
//         log.json({one: "two", three: [5, 'eight']})
//
//         log.stack(2).json({one: "two", three: [5, 'eight']})({one: "two", three: [5, 'eight']})
//
//         console.log('------------ dump');
//
//         // only one arg
//         log.dump({one: "two", three: [5, 'eight']}, 2 /* show levels (must be int > 0) */);
//
//         console.log('------------ stack dump ');
//
//         // in second cascade call 'level' is not necessary (stil .dump() accept only one ar
//         log.stack(2).dump({one: "two", three: [5, 'eight']}, 2)({one: "two", three: [5, 'eight']})
//
//
//     }());
//
// }());

// -- test --- ^^^


/**
 * log(arg1, arg2, ...)(arg1, arg2, ...)  - line and args
 * log.json(arg1, arg2, ...)(arg1, arg2, ...) - line and args as human readdable json
 * log.dump(arg1, arg2, ...)(arg1, arg2, ...) - line and args (exact description of types)
 *
 * log.stack(5)(arg1, arg2, ...)(arg1, arg2, ...)  - line and args
 * log.stack(5).json(arg1, arg2, ...)(arg1, arg2, ...) - line and args as human readdable json
 * log.stack(5).dump(arg1, arg2, ...)(arg1, arg2, ...) - line and args (exact description of types)
 *
 * and...
 * var tmp = log.stack(4)('test')
 *
 * tmp('test2')
 *
 * gives:
 * /opt/spark_dev/crawler.js:47
 * test
 * /opt/spark_dev/crawler.js:47
 * test2
 *
 */

// logic from https://github.com/gavinengel/magic-globals/blob/master/index.js

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    Object.defineProperty(global, '__stack', {
        get: function tmp() {
            var orig = Error.prepareStackTrace;
            Error.prepareStackTrace = function (_, stack) {
                return stack;
            };
            var err = new Error();
            Error.captureStackTrace(err, tmp);
            // Error.captureStackTrace(err, arguments.callee); // without 'use strict'
            var stack = err.stack;
            Error.prepareStackTrace = orig;
            return stack;
        }
    });
})();

/** returns line number when placing this in your code: __line */
// Object.defineProperty(global, '__line', {
//     get: function(){
//         return String("     " + __stack[2].getLineNumber()).slice(-5);
//     }
// });

// /** return filename (without directory path or file extension) when placing this in your code: __file */
// Object.defineProperty(global, '__file', {
//     get: function(){
//         return __stack[2].getFileName();
//     }
// });

global.__line = function () {

    function rpad(s, n) {
        typeof n === 'undefined' && (n = 5);

        if (s.length >= n) {
            return s;
        }

        return String(s + " ".repeat(n)).slice(0, n);
    }

    return function (n) {

        if (typeof n === 'undefined') {
            var tmp = [];
            for (var i in __stack) {
                tmp.push('stack: ' + rpad(i) + ' file:' + __stack[i].getFileName() + ':' + rpad(__stack[i].getLineNumber()) + ' ');
            }
            return tmp;
        }

        typeof n === 'undefined' && (n = 1);

        if (!__stack[n]) {
            throw "n key (" + n + ") doesn't exist in __stack";
        }

        return __stack[n].getFileName() + ':' + rpad(__stack[n].getLineNumber());
    };
}();

var native = function () {

    var nat = function () {
        try {
            return console.log.bind(console);
        } catch (e) {
            return function () {};
        }
    }();

    var emmit = true,
        cache = [];
    ;

    var tool = function tool() {

        var args = Array.prototype.slice.call(arguments, 0);

        if (emmit) {

            nat.apply(this, args);
        } else {

            cache = cache.concat(args);
        }
    };

    tool.start = function () {

        emmit = true;

        tool.flush();

        emmit = false;

        return tool;
    };

    tool.flush = function () {

        emmit = true;

        if (emmit && cache.length) {

            tool.call(this, cache.join("\n"));
        }

        cache = [];

        return tool;
    };

    return tool;
}();

var stack = false;

function log() {

    var s = stack === false ? 0 : stack;

    native(__line(s + 2));

    if (this !== true) {
        s += 1;
    }

    stack = false;

    native.apply(this, Array.prototype.slice.call(arguments, 0));

    return function () {
        return log.stack(s).apply(true, Array.prototype.slice.call(arguments, 0));
    };
};

log.json = function () {

    var s = stack === false ? 0 : stack;

    native(__line(s + 2));

    if (this !== true) {
        s += 1;
    }

    stack = false;

    native.start();

    Array.prototype.slice.call(arguments).forEach(function (a) {
        return (JSON.stringify(a, null, '  ') + '').split(/\n/g).forEach(function (l) {
            native(l);
        });
    });

    native.flush();

    return function () {
        return log.stack(s).json.apply(true, Array.prototype.slice.call(arguments, 0));
    };
};

log.stack = function (n /* def: 0 */) {

    if (n === false) {
        stack = n;
        return log;
    }

    var nn = parseInt(n, 10);

    if (!Number.isInteger(n) || n < 0) {
        throw "Can't setup stack to '" + nn + "' (" + n + ")";
    }

    stack = nn;

    return log;
};

(function (ll) {

    // http://stackoverflow.com/a/16608045/5560682
    function isObject(a) {
        // return (!!a) && (a.constructor === Object);
        return Object.prototype.toString.call(a) === '[object Object]'; // better in node.js to dealing with RowDataPacket object
    };
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var type = function (t) {
        return function (n) {
            if (n === undefined) {
                return 'Undefined';
            }
            if (n === null) {
                return 'Null';
            }

            t = typeof n === 'undefined' ? 'undefined' : _typeof(n);

            if (t === 'Function') {
                return t;
            }
            if (Number.isNaN(n)) {
                return "NaN";
            }
            if (t === 'number') {
                return Number(n) === n && n % 1 === 0 ? 'Integer' : 'Float';
            }

            return n.constructor ? n.constructor.name : t;
            // t = Object.prototype.toString.call(n);
            // if (t.indexOf('[object ') === 0) {
            //     t = t.substring(8);
            //     t = t.substring(0, t.length - 1);
            // }
            // return t;
        };
    }();

    function each(obj, fn, context) {
        var r;
        if (isArray(obj)) {
            for (var i = 0, l = obj.length; i < l; ++i) {
                if (fn.call(context, obj[i], i) === false) {
                    return;
                }
            }
        } else if (isObject(obj) || count(obj)) {
            for (var i in obj) {
                if (obj && obj.hasOwnProperty && obj.hasOwnProperty(i)) {
                    if (fn.call(context, obj[i], i) === false) {
                        return;
                    }
                }
            }
        }
    }

    function toString(o, k) {
        if (typeof o === 'function') {
            k = Object.keys(o).join(',');
            return k ? 'object keys:' + k : '';
        }
        return o;
    }

    // only for function
    function count(o) {
        if (typeof o === 'function') {
            for (var i in o) {
                if (o && o.hasOwnProperty && o.hasOwnProperty(i)) {
                    return true;
                }
            }
        }
        return false;
    }

    log.dump = function () {

        native.start();

        var args = Array.prototype.slice.call(arguments, 0);

        var limit = args[args.length - 1];

        if (args.length > 1 && Number.isInteger(limit) && limit > 0) {
            args.pop();
            limit -= 1;
        } else {
            limit = false;
        }

        function inner(d, l, index) {
            typeof l === 'undefined' && (l = 0);
            index = typeof index === 'undefined' ? '' : '<' + index + '> ';
            var isOb = isObject(d) || count(d);
            if (isOb || isArray(d)) {
                ll('  '.repeat(l) + index + type(d) + ' ' + (isOb ? '{' : '['));
                each(d, function (v, i) {
                    var isOb = isObject(v) || count(v) || isArray(v);
                    if (limit !== false && l >= limit && isOb) {
                        ll('  '.repeat(l + 1) + (typeof i === 'undefined' ? '' : '<' + i + '> ') + '[' + type(v) + ']: ' + '>>more<<');
                        // inner('... more: ' + type(v), l + 1, i);
                    } else {
                        inner(v, l + 1, i);
                    }
                });
                ll('  '.repeat(l) + (isOb ? '}' : ']'));
            } else {
                ll('  '.repeat(l) + index + '[' + type(d) + ']: ' + '>' + toString(d) + '<');
            }
        }

        var s = stack === false ? 0 : stack;

        native(__line(s + 2));

        if (this !== true) {
            s += 1;
        }

        stack = false;

        args.forEach(function (d) {
            inner(d);
        });

        native.flush();

        return function () {
            var args = Array.prototype.slice.call(arguments, 0);
            if (limit !== false) {
                args = args.concat(limit + 1);
            }
            return log.stack(s).dump.apply(true, args);
        };
    };
})(native);

module.exports = log;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(95)))

/***/ }),

/***/ 95:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })

/******/ });