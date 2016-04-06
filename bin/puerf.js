#! /usr/bin/env node

/**

    puerF, a commandline tool to run puer with mocked FreeMarker pages.

*/

//Dependencies.
var cli = require('commander');
var fs = require('fs');

//Submodules
var processor = require('./routePreProcessor');
var startPuer = require('./puerServer');
var logger = require('./logger');

//The puer server.
var server = null;

//Get the npm packe so we can read from it.
var package = require('./../package.json');

//Configure commandline usage.
cli
    .version(package.version)
    .usage('[cmd] [options]')
    .description('Start a puer Server and easily mock routes and render FreeMarker templates')
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
    .option('--debug', 'Display debug messages')

//Define a set up command
cli
    .command('init')
    .usage('[options]')
    .description('Set up basic folders and files tow ork with puerf')
    .option('-M, --mock-folder <folder>', 'Specify the folder for mock files')
    .option('--no-mock', 'Disables generating mock files')
    .option('-T, --template-folder <folder>', 'Specify the folder for FreeMarker templates')
    .option('--no-template', 'Disables generating template files')
    .action(function(cmd, options) {
        var initializer = require('./initializer');
        initializer.init(options);
    });

//Give some more help text
cli.on('--help', function() {
    console.log('  More info:');
    console.log('');
    console.log('    visit https://github.com/HoverBaum/puerF');
});

//Runn commander.js
cli.parse(process.argv);

//Check if we should enable debug.
if (cli.debug) {
    logger.enableDebug();
}

//Start puerf if we are not running the init script.
if(cli.args.every(elm => elm._name !== 'init')) {
    startPuerf();
}

function startPuerf() {

    //Path to ftlRoutes file.
    var ftlRoutesFile = cli.freemarker || 'mock/ftlRoutes.js';

    //Path to routes file.
    var routesFile = cli.mock || 'mock/routes.js';

    //Path to combined file.
    var combinedFile = cli.combined || 'mock/allRoutes.js';

    //Root directory for templates.
    var templatesPath = cli.templates || 'templates';

    //Watch route files for changes and act upon them.
    if (fs.existsSync(ftlRoutesFile)) {
        fs.watch(ftlRoutesFile, (event, filename) => {
            onRoutesChange();
        });
    }
    if (fs.existsSync(routesFile)) {
        fs.watch(routesFile, (event, filename) => {
            onRoutesChange();
        });
    }


    /**
     *   A function to be called when routes change.
     *   Will parse them again and tell the server to update routes.
     */
    function onRoutesChange() {
        processRouteFiles(function() {
            if (server !== null) {
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
            combinedFile
        }, callback);
    }

    /**
     *   This is where the script starts.
     */
    logger.info('Starting up...');


    //Initially parse the routes files and start the puer server.
    processRouteFiles(function() {
        logger.info('Initially compiled routes, starting server...')
        server = startPuer(combinedFile, {
            port: cli.port,
            dir: cli.root,
            ignored: cli.exclude,
            watch: cli.watch,
            localhost: cli.localhost,
            browser: cli.browser,
            templatesPath: templatesPath
        });
    });
};
