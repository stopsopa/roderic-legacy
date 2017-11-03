'use strict';

const path      = require('path');
const fs        = require('fs');

module.exports = fixed => {

    fixed.forEach(file => { // copy public.config.js.dist to public.config.js

        file = path.resolve(file.source);

        const ext = path.extname(file);

        if (ext === '.dist') {

            const newName = path.join(path.dirname(file), path.basename(file, ext));

            const f = path.relative(__dirname, file);

            const n = path.relative(__dirname, newName);

            if (fs.existsSync(newName)) {

                console.log(`CAN'T copy: ${f} to ${n}, file already exists`);
            }
            else {

                console.log(`copying: ${f} to ${n}`);

                fs.renameSync(file, newName);
            }
        }

    });

    return fixed;
};