
'use strict';

module.exports = err => {
    err = (err + '').split("\n").map(p => `    ${p}`).join("\n");
    process.stderr.write(`\nerror: \n\n${err}\n\n`);
    process.exit(-1);
};