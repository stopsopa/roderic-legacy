 rm -rf ../../app/reducers/example/fdsafdsa.js

 rm -rf ../../app/actions/example/fdsafdsa.js

 rm -rf ../../app/reducers/listReducer.js

 rm -rf ../../app/actions/listReducer.js


cat << 'EOF' > ../../app/actions/index.js

/* exports */
/* exports */
/* exports */
/* exports */
/* exports */
/* exports */

EOF

#cat << 'EOF' > ../../app/actions/one/two/index.js
#
#
#/* exports */
#
#/* exports */
#/* exports */
#/* exports */
#/* exports */
#/* exports */
#
#
#EOF



cat << 'EOF' > ../../app/reducers/index.js

import { combineReducers } from 'redux';

/* imports */
/* imports */

export default combineReducers({
    intro,
    /* combine */
    /* combine */
});

/* selectors */
/* selectors */

EOF


