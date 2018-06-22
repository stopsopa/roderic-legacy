
const path      = require('path');

const prompt    = require('prompt');

const optimist  = require('optimist');

const { json, test, dump } = require('./json');

const colors  = require('colors/safe');

const log = require('../../webpack/logn');

const schema = {
    properties: {
        name: {
            description: 'Reducer name',
            pattern: /^[a-z]{1}[a-z0-9\/\\]+$/i,
            message: 'Name of reducer (shuld match to /^[a-z]{1}[a-z0-9\\/\\\\]+$/i)',
            type: 'string',
            required: true
        },
        defaultValue: {
            description: 'Default value of reducer - init state (json format or undefined string)',
            message: 'Format: simple or json format (examples: null, true, false, {data:"string"})',
            required: true,
            conform: value => test(value),
            // before: value => (test(value) ? json(value) : value)
        },
        actions: {
            description: `List all actions: \n(if you want to create LIST_SUCCESS provide only "success" string), \nif you finish press ^C once\n`,
            message: 'Default value of reducer (simple or json format) (examples: null, true, false, {data:"string"})',
            type: 'array',
            required: true,
            // before: value => {
            //     log.dump(value);
            //     return value
            // },
            minItems: 1
        }
    }
};

module.exports = () => new Promise(resolve => {

    optimist.argv.actions && (function () {
        if (typeof optimist.argv.actions === 'string') {
            optimist.argv.actions = [optimist.argv.actions];
        }
    }());

    prompt.override = optimist.argv;

    prompt.message = "";

    prompt.delimiter = colors.green(":");

    prompt.start();

    prompt.get(schema, (err, result) => {

        result.fullSplit = result.name.split(/[\/\\]+/);

        result.name = result.fullSplit[result.fullSplit.length - 1];

        result.full = path.join.apply(this, result.fullSplit);



        // log.dump(result)
        //
        // log.dump(JSON.stringify(result.defaultValue));
        // log.dump(dump(result.defaultValue));
        //
        // process.exit(0);

        resolve(result);
    });
});