node.js


import configServer from './server.config';

import proxy from 'http-proxy-middleware';

import trimEnd from 'lodash/trimEnd';

if (configServer.php_proxy) {

    (function (c) {

        const prefix = trimEnd(c.prefix, '/');

        if (prefix && c.schema && c.host && c.port) {

            app.use(
                c.prefix,
                proxy(
                    [c.schema,'://',c.host,':',c.port].join(''),
                    {
                        changeOrigin: true,
                        pathRewrite: (path, req) => path.substring(prefix.length)   //  <----------------------
                    }
                )
            );

        }
        else {
            throw "configServer schema, prefix, host or port is wrong/missing";
        }

    }(configServer.php_proxy));
}


php: (not needed anymore)
    app.php and app_dev.php

        // [DOCUMENT_URI] => /web/app.php
        // [REQUEST_URI] => /web/app.php?jfkdlsajflkds
        // [SCRIPT_NAME] => /web/app_dev.php
        $_SERVER['DOCUMENT_URI']        = substr($_SERVER['DOCUMENT_URI'], 4);
        $_SERVER['REQUEST_URI']         = substr($_SERVER['REQUEST_URI'], 4);
        $_SERVER['SCRIPT_NAME']         = substr($_SERVER['SCRIPT_NAME'], 4);


    // and then the same endpoint from different servers will be:

    // /**
    //  * @Route("/json")
    //  */
    // public function indexAction()
    // { ...
    //
    //   php    : http://localhost:8280/json
    //   node   : http://localhost:1025/endpoint/json

nginx: (not needed anymore)
    docker/web/nginx.conf
        change:
            fastcgi_param SCRIPT_FILENAME $realpath_root/app.php$fastcgi_script_name;
        to:
            fastcgi_param SCRIPT_FILENAME $realpath_root/web/app.php$fastcgi_script_name;
