'use strict';

import 'app/other/scss/scss/scss.scss';

const log = require('log');

log('test');

document.addEventListener('DOMContentLoaded', function () {
    log('DOMContentLoaded');
    document.querySelector('#test').innerHTML = 'added in js #test <div class="text" data-test="scss - i will search for this in tests">green</div><div class="png">green</div>';
});
