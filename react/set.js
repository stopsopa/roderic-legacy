'use strict';

const path = require('path');

var cmd = (function () {

    const sync = require('child_process').spawnSync;

    return function () {

        var args = Array.prototype.slice.call(arguments);

        var s = sync.apply(this, [args.shift(), args, {
            shell: true
        }]);

        return {
            status: s.status,
            stdout: s.stdout.toString() || '',
            stderr: s.stderr.toString() || '',
        };
    };
}());

if (path.sep === '/') { // unix
    var run = ['export', 'NODE_PATH="' + path.resolve('public') + '"'];
}
else { // win
    var run = ['set', '"NODE_PATH=' + path.resolve('public') + '"'];
}

var result = cmd('export', '"NODE_PATH=NOSZKURWA"');
// var result = cmd('ls', '-la');

console.log(result)
process.exit(0);

if (result.status === 0) {
    console.log('setup');
}
else {
    console.log(JSON.stringify(result, null, '    '));
    process.exit(1);
}