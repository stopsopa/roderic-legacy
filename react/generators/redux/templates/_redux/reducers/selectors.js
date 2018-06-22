var config = {
    "mode" : "inject",
    "targetfile" : "index.js",
    "place" : {
        "start" : "/* selectors */",
        "end" : "/* selectors */",
        "place" : "append"
    }
};

/****/
export const <%= selector %> = state =>
    <%= from %>.<%= selector %>(state.<%= camel %>)
;
