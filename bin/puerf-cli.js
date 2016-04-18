#! /usr/bin/env node
/**
    Commandline interface for puerF.
*/
//TODO update optionrs
//TODO enable the use of a config file

//Use commander to handle commanline interaction.
var cli = require('commander');

//Get the npm packe so we can read from it.
var package = require('./../package.json');

//Log output.
var logger = require('./logger');

//The actual application this is a cli interface for.
var puerf = require('./puerf');

//Configure commandline usage.
cli
    .version(package.version)
    .usage('[cmd] [options]')
    .description('Start a puer Server, easily mock routes and render FreeMarker templates')
    .option('-f, --freemarker <file>', 'Mock file for Freemarker routes')
    .option('-m, --mock <file>', 'Your standard puer mock file')
    .option('-c, --combined <file>', 'Where to save the combined file, defaults to "mock/allRoutes.js"')
    .option('-t, --templates <path>', 'Path to folder in which Freemarker templates are stored')
    .option('-r, --root <folder>', 'The root folder that files should be served from')
    .option('-p, --port <number>', 'Specific port to use')
    .option('-w, --watch <files>', 'Filetypes to watch, defaults to js|css|html|xhtml|ftl')
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
    .action(function(options) {
        puerf.init(options);
    });

//Give some more help text
cli.on('--help', function() {
    console.log('  More info:');
    console.log('');
    console.log('    visit https://github.com/HoverBaum/puerF');
});


//Runn commander.js
cli.parse(process.argv);

//Set up handling of undcaught errors, so that we won't crash.
if(!cli.debug) {
    process.on('uncaughtException', function(err) {
        logger.error('Congratulations, you found a bug\nShould this keep happening, please:\n  - run with --debug\n  - file a bug report at https://github.com/HoverBaum/puerF/issues');
        logger.error(err);
    });
}



//Check if we are not running other commands.
if(cli.args.every(command => {
    command._name !== 'init';
})) {

    puerf.start(cli);

}
