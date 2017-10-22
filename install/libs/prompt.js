
const inquirer  = require('inquirer');
const trim      = require('./trim');

module.exports = message => inquirer.prompt([
    {
        type: 'input',
        name: 'val',
        message: message,
        filter: function (val) {

            val = trim(val);

            if (val === 'Y' || val === 'N') {

                return val.toLowerCase();
            }

            return val;
        }
    }
]).then(answers => answers.val);