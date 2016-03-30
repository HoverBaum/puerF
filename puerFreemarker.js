var cli = require('commander');

//Submodules
var processor = require('./routePreProcessor');

//Configure commandline usage.
cli
    .usage('puerF [options]')
    .option('-f, --freemarker <file>', 'Mock file for Freemarker routes')
    .option('-m, --mock <file>', 'Your standard puer mock file')
    .option('-c, --combined <file>', 'Where to save the combined file, defaults to "mock/allRoutes.js"')
    .option('-t, --templates <path>', 'Path to folder in which Freemarker templates are stored')
    .option('-p, --port', 'Specific port to use')
    .option('-w, --watch', 'Filetypes to watch, defaults to js|css|html|xhtml')
    .option('-x, --exclude', 'Exclude files from being watched for updates')
    .parse(process.argv);

//Path to ftlRoutes file.
var ftlRoutesFile = cli.freemarker || 'mock/ftlRoutes';

//Path to routes file.
var routesFile = cli.mock || 'mock/routes';

//Path to combined file.
var combinedFile = cli.combined || 'mock/allRoutes.js';

//Root directory for templates.
var templatesPath = cli.templates || 'templates';

//Initially generate a combined version of the routes files.
processor.process(routesFile, ftlRoutesFile, combinedFile, templatesPath);

//Watch route files for changes and act upon them.
