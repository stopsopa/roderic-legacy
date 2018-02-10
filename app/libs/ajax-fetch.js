
import node from 'detect-node';

/**
 * @date 2018-02-01
 *
 * I introduced main transport tool (server) based on old fasion ajax on purpose, that's not mistake.
 * The reason is lack in chrome "Replay XHR" in chrome.
 * But it is though provided through fetch polyfill so it will be easy to revert it back
 * when they finally implement "Replay XHR"
 */
if (node) {

    // log("\n\n" + 'attempt to polyfill node' + "\n\n");

    eval('require')('isomorphic-fetch');

    global.server = fetch;

    // global.server = (...args) => {
    //
    //     log("\n\n" + 'node fetch polyfill' + "\n\n");
    //
    //     return fetch(...args)
    // };
}
else {

    // log("\n\n" + 'attempt to polyfill browser' + "\n\n");

    (function (old) { // https://github.com/github/fetch/issues/544

        window.fetch = undefined;

        require('whatwg-fetch');

        window.server = fetch;

        window.fetch = old;

        // window.fetch = (...args) => {
        //
        //     log('browser fetch polyfill');
        //
        //     return old(...args)
        // };

    }(window.fetch));
}


