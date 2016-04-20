/**

    A module to process routes.js and tflRoutes.js files into a single file.

    @module routePreProcessor
*/

//Required packages for this to work.
var fs = require('fs');
var path = require('path');
var helper = require('./helper');
var logger = require('./logger');

module.exports = function routePreProcessor() {

    /**
     *   Process all routes files into a combined one.
     */
    function processFiles(routeFilePaths, combinedFilePath, callback) {
        logger.debug('Combining routes', {combinedFilePath, routeFilePaths});
        helper.guarantyFolder(combinedFilePath);
        var allRoutes = {};
        routeFilePaths.forEach(filePath => {
            var absPath = helper.absolutePath(filePath);
            logger.debug('Including routes from', absPath);
            var routes = helper.loadModule(absPath);
            for(key in routes) {
                if(allRoutes[key]) {
                    logger.warn('A route got defined in multiple files', key);
                }
                allRoutes[key] = parseRoute(routes[key], absPath);
            }
        });
        var combinedFile = createCombinedFile(allRoutes);
        logger.debug('Routes files got combined');
        saveCombined(combinedFile, combinedFilePath, callback)
    }

    /**
    *   Parse a single route, turn a routeObject into a function to be called.
    */
    function parseRoute(route, filePath) {
        if(route.handler) {
            return route.handler;
        } else if(route.template) {
            return parseFtlRoute(route, filePath);
        } else if(route.data) {
            return parseDataRoute(route);
        } else if(route.jsonFile) {
            return parseJSONRoute(route, filePath);
        } else {
            logger.warn('A route seems to have no configuration.', {file: filePath});
            return `function() {}`;
        }
    }

    /**
    *   Parse a route which provides data.
    */
    function parseDataRoute(route) {
        var dataString = JSON.stringify(route.data);
        return `function(req, res, next) {
            var data = JSON.parse('${dataString.replace(/\\/g, '\\\\')}');
            res.send(data);
        }`;
    }

    /**
    *   Parse a route which provides data from a json file.
    */
    function parseJSONRoute(route, filePath) {
        var absPath = path.resolve(path.dirname(filePath), route.jsonFile);
        return `function(req, res, next) {
            var fileData = fs.readFileSync('${absPath.replace(/\\/g, '\\\\')}');
            var data = JSON.parse(fileData);
            res.send(data);
        }`;
    }

    /**
     *   Converts a ftlRoutes config object so that it can be added into the combined routes file.
     */
    function parseFtlRoute(config, ftlRoutesFile) {
        var dataString = '';
        if (config.data) {
            dataString = `var fmData = JSON.parse('${JSON.stringify(config.data)}');`;
        } else if (config.jsonFile) {
            var absPath = path.resolve(path.dirname(ftlRoutesFile), config.jsonFile);

            //We read the file in and parse it to make sure we have the up to date version of mocked data.
            dataString = `var fileData = fs.readFileSync('${absPath.replace(/\\/g, '\\\\')}');
            var fmData = JSON.parse(fileData);`;
        }
        return `function(req, res, next) {
            ${dataString}
            fm.render('${config.template}', fmData, function(err, data, out) {
                if(/.+DONE.+/.test(out)) {
                    logger.debug('FreeMarker said', out);
                } else {
                    logger.warn('FreeMarker said', out);
                }
                if(err) {
                    throw err;
                }
                res.writeHeader(200, {
                    "Content-Type": "text/html"
                });
                res.write(data);
                res.end();
            });
        }`;
    }

    /**
     *   Uses all routes to write a file that can be used with puer.
     */
    function createCombinedFile(routes) {
        var start = `module.exports = {`;
        var end = `}`;
        var middle = createMiddleString(routes);
        var combined = start + middle + end;
        return combined;
    }

    /**
     *   Parses routes into a string.
     */
    function createMiddleString(routes) {
        var string = '';
        for (key in routes) {
            string += `\n"${key}": ${routes[key]},`;
        }

        //Remove the last ','.
        string = string.replace(new RegExp(',' + '$'), '\n');
        return string;
    }

    /**
     * Saves the combined file.
     */
    function saveCombined(content, filePath, callback) {
        fs.writeFile(filePath, content, function() {
            if (callback !== undefined) {
                callback();
            }
        });
    }

    return {
        process: processFiles
    }

}();
