var config = {
    "mode" : "inject",
    "targetfile" : "types.js",
    "place" : {
        "start" : "/* types */",
        "end" : "/* types */",
        "place" : "append"
    }
};

/****/
<% actions.forEach(action => { %>export const <%= getType(action) %> = '<%= getType(action) %>';
<% }) %>