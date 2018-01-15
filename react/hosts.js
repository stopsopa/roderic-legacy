
const defaultKey = 'localhost';

/**
 * just detect set of configuration based on hostname and working directory
 */
module.exports = (function (host, dir, list, key) {

    const keys = Object.keys(list);

    for (let i = 0, l = keys.length ; i < l ; i += 1 ) {

        key = keys[i];

        if (host.indexOf(key) > -1) {

            return list[key];
        }
    }

    return list[defaultKey];

}(
    require('detect-node') ? eval('require')('os').hostname() : defaultKey,
    __dirname,
    {
        'hostname1': {
            ssr: {
                host: 'localhost', // localhost instead of ses.phaseiilabs.com because it's gonna use only local network
                port: 82 // directly to node server - it will be faster
            },
            server: {
                host: '0.0.0.0',
                port: 82,
            }
        },
        'hostname2': {
            ssr: {
                host: 'localhost', // localhost instead of ses.phaseiilabs.com because it's gonna use only local network
                port: 82 // directly to node server - it will be faster
            },
            server: {
                host: '0.0.0.0',
                port: 82,
            }
        },
        localhost: { // default config if none of above is matched
            ssr: {
                host: 'localhost',
                port: 1025
            },
            server: {
                host: '0.0.0.0', // bind to all interfaces by default
                port: 1025,
            }
        }
    }
));