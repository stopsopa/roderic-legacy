var config = {
    "mode" : "inject",
    "targetfile" : "index.js",
    "place" : {
        "start" : "/* exports */",
        "end" : "/* exports */",
        "place" : "append"
    }
};

/****/
export * from './<%= full %>';
