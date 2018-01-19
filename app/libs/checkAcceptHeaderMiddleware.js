
let cache;

module.exports = (req, res, next) => {

    cache = req.get('accept');

    if ( ! ( (cache || '').toLowerCase().indexOf('text/html') > -1) ) {

        return res.status(400).end('no text/html in content type ' + cache);
    }

    next();
}