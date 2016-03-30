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

module.exports = function routePreProcessor() {

    /**
     *   Process both the regular and the ftlRoutes file into a single one.
     */
    function processFiles(routesFile, ftlRoutesFile, combinedFile, templatesPath) {
        routesFile = './' + routesFile.replace('.js', '');
        ftlRoutesFile = './' + ftlRoutesFile.replace('.js', '');
        var routes = require(routesFile);
        var ftlRoutes = require(ftlRoutesFile);
        for (key in ftlRoutes) {
            routes[key] = convertFtl(ftlRoutes[key]);
        }
        var combined = createCombinedFile(routes, templatesPath);
        saveCombined(combined, combinedFile)
    }

    /**
     *   Converts a ftlRoutes config object so that it can be added into the combined routes file.
     */
    function convertFtl(config) {
        return function() {
            fm.render(config.template, config.data, function(err, data, out) {
                res.writeHeader(200, {
                    "Content-Type": "text/html"
                });
                res.write(data);
                res.end();
            });
        }
    }

    /**
     *   Uses all routes to write a file that can be used with puer.
     */
    function createCombinedFile(routes, templatesPath) {
        var start = `var Freemarker = require('Freemarker');
            var fm = new Freemarker({
              viewRoot: path.join(__dirname, '${templatesPath}')
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
    function saveCombined(content, filePath) {
        fs.writeFile(filePath, content);
    }

    return {
        process: processFiles
    }

}();
