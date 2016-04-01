/**

    This module provides helper function for puerF.

*/

//dependencies
var fs = require('fs');

module.exports = function() {

    /**
     *   Load a module without using a cache.
     */
    function loadModuleWithoutCache(path) {

        //Make sure file has js ending.
        if (!/\.js$/.test(path)) {
            path += '.js';
        }

        //Read the module and return the exports.
        // more info: http://eloquentjavascript.net/10_modules.html#h_v/XE3QWFpP
        var code = new Function("exports, module", fs.readFileSync(path));
        var exports = {},
            module = {
                exports: exports
            };
        code(exports, module);
        return module.exports;
    }

    return {
        loadModule: loadModuleWithoutCache
    }

}();
