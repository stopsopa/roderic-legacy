
module.exports = message => process.stdout.write(['\x1B[', 36, 'm', message + ' ', '\x1B[0m'].join(''));