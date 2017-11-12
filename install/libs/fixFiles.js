'use strict';

const fs        = require('fs');
const ask       = require('./ask')();

module.exports = (function () {

    const reg = /\/\/ this will be removed by installator[\s\S]*?\/\/ this will be removed by installator/g;

    return list => Promise.all(list.map(file => {

        if (file.template && fs.existsSync(file.source)) {

            let content = fs.readFileSync(file.source);

            if (content) {

                content = content.toString();

                return ask(content).then(content => {

                    if ( ! ask.get('travis') ) {

                        content = content.replace(reg, '');
                    }

                    fs.writeFileSync(file.source, content)
                }).then(() => `changed: ${file.source}`);
            }
        }

        return Promise.resolve(`NOT changed: ${file.source}`);
    })).then(() => list);
}());

