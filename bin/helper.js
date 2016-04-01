/**

    This module provides helper function for puerF.

*/

//dependencies
var fs = require('fs');
var logger = require('./logger');

module.exports = function() {

    /**
     *   Load a module without using a cache.
     */
    function loadModuleWithoutCache(path) {
        logger.silly('Load module called with ', path);

        //Make sure file has js ending.
        if (!/\.js$/.test(path)) {
            path += '.js';
        }

        //Read the module and return the exports.
        // more info: http://eloquentjavascript.net/10_modules.html#h_v/XE3QWFpP
        logger.debug('Loading module without cache from ', path);
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
