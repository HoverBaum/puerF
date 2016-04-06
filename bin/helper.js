/**

    This module provides helper function for puerF.

*/

//dependencies
var fs = require('fs');
var path = require('path');
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
        var code = dummyFunction;
        if (fs.existsSync(path)) {
            code = new Function("exports, module", fs.readFileSync(path));
        }
        var exports = {},
            module = {
                exports: exports
            };
        code(exports, module);
        return module.exports;
    }

    function dummyFunction(exports, modules) {
        exports = {};
    }

    /**
     *   Makes sure that a path exists, not a file but the deepest folder.
     */
    function makeSureFolderExists(pathToCheck) {

        //If the path containes a file ending, cut that away.
        if (path.extname(pathToCheck) !== '') {
            pathToCheck = path.dirname(pathToCheck);
        }
        if (!fs.existsSync(pathToCheck)) {
            fs.mkdirSync(pathToCheck);
        }
    }

    /**
     *   Returns the absolute path, relative paths are resolved relative to executing dir.
     */
    function getAbsolutePath(uri) {
        var absolute = path.resolve(process.cwd(), uri);
        logger.silly('Created an absolute path', {
            cwd: process.cwd(),
            path: uri,
            absolute: absolute
        });
        return absolute;
    }

    return {
        loadModule: loadModuleWithoutCache,
        guarantyFolder: makeSureFolderExists,
        absolutePath: getAbsolutePath
    }

}();
