var cli = require('commander');
var fs = require('fs');

//Submodules
var processor = require('./routePreProcessor');
var startPuer = require('./puerServer');

//The puer server.
var server = null;

//Configure commandline usage.
cli
    .usage('puerF [options]')
    .option('-f, --freemarker <file>', 'Mock file for Freemarker routes')
    .option('-m, --mock <file>', 'Your standard puer mock file')
    .option('-c, --combined <file>', 'Where to save the combined file, defaults to "mock/allRoutes.js"')
    .option('-t, --templates <path>', 'Path to folder in which Freemarker templates are stored')
    .option('-r, --root <folder>', 'The root folder that files should be served from')
    .option('-p, --port <number>', 'Specific port to use')
    .option('-w, --watch <files>', 'Filetypes to watch, defaults to js|css|html|xhtml')
    .option('-x, --exclude <files>', 'Exclude files from being watched for updates')
    .option('-l, --localhost', 'Use "localhost" instead of "127.0.0.1"')
    .option('--no-browser', 'Do not autimatically open a brwoser')
    .parse(process.argv);

//Path to ftlRoutes file.
var ftlRoutesFile = cli.freemarker || 'mock/ftlRoutes.js';

//Path to routes file.
var routesFile = cli.mock || 'mock/routes.js';

//Path to combined file.
var combinedFile = cli.combined || 'mock/allRoutes.js';

//Root directory for templates.
var templatesPath = cli.templates || 'templates';

//Watch route files for changes and act upon them.
fs.watch(ftlRoutesFile, (event, filename) => {
    onRoutesChange();
});
fs.watch(routesFile, (event, filename) => {
    onRoutesChange();
});

/**
*   A function to be called when routes change.
*   Will parse them again and tell the server to update routes.
*/
function onRoutesChange() {
    processRouteFiles(function() {
        if(server !== null) {
            server.updateRoutes();
        }
    });
}

/**
 *   Process both route files with given config.
 */
function processRouteFiles(callback) {
    processor.process({
        routesFile,
        ftlRoutesFile,
        combinedFile,
        templatesPath
    }, callback);
}

//Initially parse the routes files and start the puer server.
processRouteFiles(function() {
    server = startPuer(combinedFile, {
        port: cli.port,
        dir: cli.root,
        irgnored: cli.exclude,
        watch: cli.watch,
        localhost: cli.localhost,
        browser: cli.browser
    });
});
