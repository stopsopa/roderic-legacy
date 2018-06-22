
// @todo config.js with default appDir and templateDir
// @todo provide --set=default parameter ('default' will be default)
// @todo throw exception if wrong params specified (example --action instead of --actions)
// yarn add optimist
// yarn add prompt
// yarn add colors
// yarn add lodash

const path = require('path');

const fs = require('fs');

const ask = require('./redux/ask');

const log = require('../webpack/logn');

const utils = require('./redux/utils');

const json = require('./redux/json');

const upperFirst = require('lodash/upperFirst');

const exit = msg => {
    log.stack(1).dump(msg);
    process.exit(-1);
}

const appDir        = path.resolve(__dirname, '../../app');

const templatesDir  = path.resolve(__dirname, 'redux', 'templates');

// node redux.js --name example --defaultValue "[1]" --actions success
// node redux.js --name example --defaultValue "[1]" --actions success --actions second
// node redux.js --name dir\\example --defaultValue "[1]" --actions success --actions second
// node redux.js --name dir/example --defaultValue "[1]" --actions success --actions second
// --defaultValue undefined
// --defaultValue true
// --defaultValue false
// --defaultValue 56
// --defaultValue "[\"tst\"]"
// --defaultValue "{\"test\":\"value\"}"
// yarn redux --name home/intro --defaultValue "{}" --actions request --actions success --action failure
// yarn redux --defaultValue "{}" --actions request --actions success --actions failure --name home/community
ask().then(ps => {

    const relativeToApp = function (templateFileToInject) {
        return inc => {

            const tmp = './' + path.relative(path.dirname(templateFileToInject), path.resolve(appDir, inc));

            if (tmp.indexOf('./../') === 0) {

                return tmp.substring(2);
            }

            return tmp;
        };
    }

    const extend = name => {

        const camel = utils.method(ps.full);

        return Object.assign({}, ps, {
            relativeInApp: relativeToApp(name),

            // with params
            getType     : action    => utils.split(ps.full).concat(utils.split(action)).join('_').toUpperCase(),
            getAction   : action    => utils.method(utils.split(ps.full).concat(utils.split(action))),

            // with no params
            camel       : camel,
            selector    : `get${upperFirst(camel)}`,
            from        : `from${upperFirst(camel)}`,
            json        : data      => json.dump(data)
        })
    }
    // Object {
    //   <name> [String]: >fdsafdsa< len: 8
    //   <defaultValue> [String]: >[1]< len: 3
    //   <actions> Array [
    //     <0> [String]: >success< len: 7
    //     <1> [String]: >test< len: 4
    //   ]
    //   <fullSplit> Array [
    //     <0> [String]: >example< len: 7
    //     <1> [String]: >fdsafdsa< len: 8
    //   ]
    //   <full> [String]: >example/fdsafdsa< len: 16
    // }

    const list = utils.findFiles(templatesDir);

    const execute = real => list.forEach(file => {

        const meta = utils.read(file, ps);

        // validation
        switch (meta.metadata.mode) {
            case 'create-file':

                if ( ! meta.metadata.filename) {

                    exit(`meta 'filename' is not specified in file: '${file}'`)
                }

                break;
            case 'inject':

                if ( ! meta.metadata.targetfile) {

                    exit(`meta 'targetfile' is not specified in file: '${file}'`)
                }

                if ( ! meta.metadata.place) {

                    exit(`meta 'place' is not specified in file: '${file}'`)
                }

                if ( ! meta.metadata.place.start) {

                    exit(`meta 'place.start' is not specified in file: '${file}'`)
                }

                if ( ! meta.metadata.place.end) {

                    exit(`meta 'place.end' is not specified in file: '${file}'`)
                }

                if ( ! (meta.metadata.place.place === 'prepend' || meta.metadata.place.place === 'append') ) {

                    exit(`meta 'place.place' has wrong value (${meta.metadata.place.place}) in file: '${file}'`);
                }

                break;
        }

        // execution

        const relativeTmp = path.relative(templatesDir, file);

        let target;

        switch (meta.metadata.mode) {
            case 'create-file':

                const appNewFile = path.resolve(appDir, path.relative(templatesDir, path.dirname(file)), ps.full + '.js');

                const contentForNewFile             = utils.template(meta.tmp)(extend(appNewFile));

                utils.dirEnsure(path.dirname(appNewFile), true);

                if (fs.existsSync(appNewFile)) {

                    exit(`File '${appNewFile}' already exist`);
                }

                if (real) {

                    fs.writeFileSync(appNewFile, contentForNewFile);
                }

                target = path.relative(path.dirname(appDir), appNewFile);

                break;
            case 'inject':

                const realFileToInject                      = path.resolve(appDir, path.relative(templatesDir, path.dirname(file)), meta.metadata.targetfile);

                if ( ! fs.existsSync(realFileToInject) ) {

                    exit(`realFileToInject file "${realFileToInject}" doesn't exist`);
                }

                const realFileToInjectContent               = fs.readFileSync(realFileToInject).toString();

                const contentToInject                       = utils.template(meta.tmp)(extend(realFileToInject));

                if (realFileToInjectContent.indexOf(contentToInject) > -1) {

                    exit(`
In file: '${realFileToInject}' content already exist:

${contentToInject}
`);
                }

                const realFileToInjectContentNewContent     = utils.inject(
                    realFileToInjectContent,
                    contentToInject,
                    meta.metadata.place.start,
                    meta.metadata.place.end,
                    meta.metadata.place.place === 'append'
                );

                if (real) {

                    fs.writeFileSync(realFileToInject, realFileToInjectContentNewContent);
                }

                target = path.relative(path.dirname(appDir), realFileToInject);

                break;
        }

        real && process.stdout.write(`Processing template file (mode:${meta.metadata.mode}): ${relativeTmp}
    target in project: ${target}

`);
    });

    try {

        execute();
    }
    catch (e) {

        // @todo generate command

        console.log(`
    
    Looks like script crashed, in order to run this command again with the same parameters run:
    
                node redux.js --name example --defaultValue "[1]" --actions success --actions second
                
                
`)
        throw e;
    }

    execute(true);
}, e => {
    log.dump(e)
});







// const read =
//
// const inject =
//
//
// const beforeData = read(source);
//
// // log.dump(beforeData);
// //
// // process.exit(0);
//
// if ( ! fs.existsSync(target) ) {
//
//     throw `file "${target}" doesn't exist`;
// }
//
// const targetContent = fs.readFileSync(target).toString();
//
// var inj = inject(targetContent, `new content for this file
//
// `, beforeData.metadata.place.start, beforeData.metadata.place.end, true);
//
//
// log.dump(inj)



// ask()
//     // .then(result => {
//     //     return new Promise(resolve => setTimeout(() => resolve(result), 1000))
//     // })
//     .then(result => {
//         log("\n\n");
//         log('result');
//         log.dump(result)
//     });