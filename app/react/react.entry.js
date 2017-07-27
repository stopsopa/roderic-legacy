'use strict';

'use strict';

// import 'scss/react.scss';
// import 'css/icontrol_big_gray.css';

import 'app/react/style/global.scss';
import 'app/react/style/react.scss';
import React from 'react';
// import ReactDOM from 'react-dom';
import {render} from 'react-dom';
import App from './app/App';

let github = /github/.test(location.href);

// github = true; // for test

const url = github ? 'asset/rassets/db.json' : 'asset/rassets/db.php' ;

render(<App url={url} github={github}/>, document.getElementById('app'));
