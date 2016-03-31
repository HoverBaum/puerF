/**
    A module to process routes.js and tflRoutes.js files into a single file.

    module.process(routesFile, ftlRoutesFile, combinedFile, templatesPath)
    @param routesFile       The path the the routes file.
    @param ftlRoutesFile    Path to the file containing tflRoutes.
    @param combinedFile     The file in which to save the combined version.
    @param templatesPath    Where templates can be found.

*/

//Required packages for this to work.
var fs = require('fs');
var path = require('path');

module.exports = function routePreProcessor() {

    /**
     *   Process both the regular and the ftlRoutes file into a single one.
     */
    function processFiles(options, callback) {
        var routesFile = options.routesFile;
        var ftlRoutesFile = options.ftlRoutesFile;
        var combinedFile = options.combinedFile;
        var templatesPath = options.templatesPath;
        var routes = loadModule(routesFile);
        var ftlRoutes = loadModule(ftlRoutesFile)
        for (key in ftlRoutes) {
            routes[key] = convertFtl(ftlRoutes[key]);
        }
        var combined = createCombinedFile(routes, templatesPath);
        saveCombined(combined, combinedFile, callback)
    }

    /**
     *   Loades a module manullay without caching it like require does.
     */
    function loadModule(path) {
        var code = new Function("exports, module", fs.readFileSync(path));
        var exports = {},
            module = {
                exports: exports
            };
        code(exports, module);
        return module.exports;
    }

    /**
     *   Converts a ftlRoutes config object so that it can be added into the combined routes file.
     */
    function convertFtl(config) {
        return `function(req, res, next) {
            var data = JSON.parse('${JSON.stringify(config.data)}');
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
    function createCombinedFile(routes, templatesPath) {
        var viewRoot = path.join(__dirname, templatesPath);
        viewRoot = viewRoot.replace(/\\/g, "\\\\"); //HACK this is an ugly hackaround for windows.
        var start = `var Freemarker = require('freemarker.js');
            var fm = new Freemarker({
              viewRoot: '${viewRoot}'
            });
            module.exports = {`;
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
     *
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
