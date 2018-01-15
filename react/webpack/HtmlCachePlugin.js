
const path = require('path');

const htmlcache = require(path.resolve(__dirname, 'htmlcache'));

/**
 * https://webpack.js.org/concepts/plugins/
 * https://github.com/webpack/docs/wiki/plugins
 */
class HtmlCachePlugin {
    constructor(files) {
        this.files = files;
    }

    apply(compiler) {
        compiler.plugin('after-emit', (compiler, callback) => {

            const time = htmlcache.now();

            this.files.forEach(file => {

                console.log(`HtmlCachePlugin plugin: ${file}`);

                htmlcache.inFile(file, time);
            })

            callback();
        });
    }
}
module.exports = HtmlCachePlugin;