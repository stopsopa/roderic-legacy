var config = {
    "mode" : "inject",
    "targetfile" : "index.js",
    "place" : {
        "start" : "/* imports */",
        "end" : "/* imports */",
        "place" : "append"
    }
};

/****/
import <%= camel %>, * as <%= from %> from './<%= full %>';
