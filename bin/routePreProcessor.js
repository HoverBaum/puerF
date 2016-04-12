/**

    A module to process routes.js and tflRoutes.js files into a single file.

    Call process with the following options:
    routesFile      File to puerRoutes
    ftlRoutesFile   File for ftl routesFile
    combinedFile    File in which to combine routes

*/

//Required packages for this to work.
var fs = require('fs');
var path = require('path');
var helper = require('./helper');
var logger = require('./logger');

module.exports = function routePreProcessor() {

    /**
     *   Process both the regular and the ftlRoutes file into a single one.
     */
    function processFiles(options, callback) {
        helper.guarantyFolder(options.combinedFile);
        var routesFile = options.routesFile;
        var ftlRoutesFile = options.ftlRoutesFile;
        var combinedFile = options.combinedFile;
        var routes = helper.loadModule(helper.absolutePath(routesFile));
        logger.silly('Routes file loaded', routes);
        var ftlRoutes = helper.loadModule(helper.absolutePath(ftlRoutesFile));
        logger.silly('FTLRoutes loaded', ftlRoutes);
        for (key in ftlRoutes) {
            routes[key] = convertFtl(ftlRoutes[key], ftlRoutesFile);
        }
        var combined = createCombinedFile(routes);
        logger.debug('Routes files got combined');
        logger.silly('New combined routes file', combined);
        saveCombined(combined, combinedFile, callback)
    }

    /**
     *   Converts a ftlRoutes config object so that it can be added into the combined routes file.
     */
    function convertFtl(config, ftlRoutesFile) {
        var data = {};
        if(config.data) {
            data = config.data;
        } else if(config.jsonFile) {
            var absPath = path.resolve(path.dirname(ftlRoutesFile), config.jsonFile).replace(/\.json$/, '');
            data = require(absPath);
        }
        return `function(req, res, next, fm) {
            var data = JSON.parse('${JSON.stringify(data)}');
            fm.render('${config.template}', data, function(err, data, out) {
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
        logger.silly('Creating combined file', routes);
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
        logger.silly('Middlestring for combined routes', string);
        return string;
    }

    /**
     * Saves the combined file.
     */
    function saveCombined(content, filePath, callback) {
        fs.writeFile(filePath, content, function() {
            if(callback !== undefined) {
                callback();
            }
        });
    }

    return {
        process: processFiles
    }

}();
