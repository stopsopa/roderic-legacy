const config = {
    "mode" : "create-file",
    "filename" : "<%= full %>.js"
};

/****/
import {
<% actions.forEach(action => { %>    <%= getType(action) %>,
<% }) %>} from '<%= relativeInApp("_redux/actions/types") %>';

export default (state = <%= defaultValue %>, action) => {
    switch (action.type) {
        <% actions.forEach(action => { %>case <%= getType(action) %>:
            return action.payload;
        <% }) %>default:
            return state;
    }
}

export const <%= selector %> = state => state;
