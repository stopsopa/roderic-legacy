'use strict';

// https://gist.github.com/stopsopa/33452ebcb50c53e38225beb60edd5e66
module.exports = function (input, execute, slots) {
    const output = [];
    let count = 0;
    (slots > 0) || (slots = 1);
    return new Promise(function (resolve) {
        (function next() {
            if (input.length) {
                if (count < slots) {
                    count += 1;
                    execute(input.shift()).then(function (data) {
                        output.push(data);
                        count -= 1;
                        next();
                    });
                    next();
                }
                return;
            }
            count || resolve(output);
        }());
    });
};