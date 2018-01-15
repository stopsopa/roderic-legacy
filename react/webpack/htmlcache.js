
const fs = require('fs');

const reg = /([&\?]_=)\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/g;

function now() {
    return (new Date()).toISOString().substring(0, 19).replace('T', '_').replace(/[^\d_]/g, '-');
}

function replace(content, time) {

    if (typeof content !== 'string') {

        throw `content is not string`;
    }

    time = time || now();

    return content.replace(reg, `$1${time}`);
}

replace.now = now;

replace.inFile = function (file, time) {

    if ( ! fs.existsSync(file)) {

        throw `file '${file}' doesn't exist`;
    }

    try {
        fs.accessSync(file, fs.constants.R_OK);
    }
    catch (e) {

        throw `file '${file}' is not readdable`;
    }

    try {
        fs.accessSync(file, fs.constants.W_OK);
    }
    catch (e) {

        throw `file '${file}' is not writtable`;
    }

    const content = replace(fs.readFileSync(file).toString(), time);

    fs.writeFileSync(file, content);

    return content;
};

if (require && module && require.main === module) {

    const list = process.argv.slice(2);

    if (list.length) {

        list.forEach(replace.inFile);
    }
    else {

        const path = require('path');

        console.error(`run:\n    node ${path.basename(__filename)} [path to file]`);

        process.exit(1);
    }

} else {

    module.exports = replace;
}