'use strict';

const path              = require('path');
const bodyParser        = require('body-parser');
const fs                = require('fs');
const express           = require('express');
const compression       = require('compression');
const config            = require(path.resolve(__dirname, 'config'));
const log               = console.log;

const ip = process.argv[2], port = parseInt(process.argv[3]);

process.on('uncaughtException', function (e) {
    switch (true) {
        case (e.code === 'EADDRINUSE' && e.errno === 'EADDRINUSE'):
            process.stdout.write(`Address ${ip}:${port} already in use - server killed\n\n`);
            break;
        case (e.code === 'EACCES' && e.errno === 'EACCES'):
            process.stdout.write(`No access to take ${ip}:${port} address - server killed - (use sudo)\n\n`);
            break;
        default:
            if (typeof e === 'string') {
                process.stdout.write(e);
            }
            else {
                process.stdout.write(JSON.stringify(e, null, '    '));
            }
    }
});

if ( ! (process.argv.length > 3) ) {

    throw "try to call for example 'node " + path.basename(__filename) + " 0.0.0.0 80'";
}

// http://www.w3resource.com/javascript/form/ip-address-validation.php
if ( ! /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {

    throw `first argument should have format of ip address eg: 127.168.10.105 and is '${ip}'`;
}

if ( port < 0 || port > 65535 ) {

    throw "port beyond range 0 - 65535 : '" + port + "'";
}

// log(JSON.stringify(config, null, '    '));
// process.exit(0);

const app               = express();

app.use(compression({filter: shouldCompress}))

function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
}

app.all(/^\/(redux|router)\/([^\/]+)\/(.*)?$/, (req, res) => {

    const dir = path.join(req.params[0],req.params[1]);

    // https://expressjs.com/en/4x/api.html#res.sendFile

    const rel   = path.join(dir, 'app.html');

    // log('rel', rel);
    // log('web', config.web)

    const file  = path.join(config.web, rel);

    // log('file', file, fs.existsSync(file) ? 'true' : 'false');

    if (fs.existsSync(file)) {

        const options = {
            root: config.web,
            // dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        let html = fs.readFileSync(file);

        // if (/<div id="app"><\/div>/.test(html)) {
        //
        //
        // }
        // else {
            res.set({
                'Content-type' : 'text/html; charset=utf-8'
            })
            .send(html);
        // }

        // res.sendFile(rel, options, function (err) {
        //     if (err) {
        //         log('error', err)
        //         // next(err);
        //     } else {
        //         // log('Sent:', file);
        //     }
        // });
    }
    else {

        res.send(`File '${file}' doesn't exist`);
    }
});

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json()); // https://github.com/expressjs/body-parser#expressconnect-top-level-generic

app.use(express.static(config.web));

app.listen(port, ip, () => {
    log(`Server is running ${ip}:${port}`)
});
