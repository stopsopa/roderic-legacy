

module.exports = function log() {
    Array.prototype.slice.call(arguments).map(i => i + "\n").forEach(i => process.stdout.write(i));
};