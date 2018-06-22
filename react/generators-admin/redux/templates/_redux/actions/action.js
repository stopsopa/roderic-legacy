const config = {
    "mode" : "create-file",
    "filename" : "<%= full %>.js"
};

/****/
import {
<% actions.forEach(action => { %>    <%= getType(action) %>,
<% }) %>} from '<%= relativeInApp("_redux/actions/types") %>';

import {
    fetchJson, fetchData
} from '<%= relativeInApp("transport") %>';
<% actions.forEach(action => { %>
export const <%= getAction(action) %> = () => ({
    type: <%= getType(action) %>
});
<% }) %>
