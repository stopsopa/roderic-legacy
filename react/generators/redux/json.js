
// var d = data => JSON.parse(data);
// var e = data => JSON.stringify(data);

const json = data => {

    if (data === undefined) {

        return 'undefined';
    }

    if (data === 'null' || data === 'undefined') {

        return data;
    }

    return JSON.parse(data);
}

const dump = data => {

    if (data === undefined) {

        return 'undefined';
    }

    return JSON.stringify(data, null, '    ');
};

const test = data => {
    try {
        json(data);
        return true;
    }
    catch (e) {
        return false;
    }
}

module.exports = {
    json: json,
    test: test,
    dump: dump
};

