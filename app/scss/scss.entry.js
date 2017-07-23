'use strict';

import './scss/scss.scss';

const log = require('log');

log('test');

document.addEventListener('DOMContentLoaded', function () {
    log('DOMContentLoaded');
    document.querySelector('#test').innerHTML = 'added in js #test <div class="text">green</div><div class="png">green</div>';
});
