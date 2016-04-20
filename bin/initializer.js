/**
    Module to create basic working environment for puerf.
    Will create folders and files to demonstrate features.

    @module initializer
*/

var path = require('path');
var fs = require('fs');
var logger = require('./logger');
var helper = require('./helper');


/**
 *   Starts setting up basic files to work with puerF.
 *
 *   @param options {object} Options for the intializer. The only possible one is "onlyConfig".
 *   @param callback {function} Function to call once done.
 */
module.exports = function startInitialization(options, callback) {
    logger.info('Initializing a basic setup for puerf');
    if (options.root === undefined) {
        options.root = process.cwd();
    }
    if (options.onlyConfig) {
        logger.info('Will only generate a config file');
    } else {
        createMockFiles(options.root);
        createTemplateFiles(options.root);
    }
    createConfigFile(options.root);
    logger.info(`Finished setting up, let's role`);
    if (callback) callback();
}

/*
 *   Creates std. mock files if none exist.
 */
function createMockFiles(root) {
    var folder = path.join(root, 'mock');
    var folderPath = helper.absolutePath(folder);
    helper.guarantyFolder(folderPath);
    var routesFile = path.join(folderPath, 'routes.js');
    var ftlRoutesFile = path.join(folderPath, 'ftlRoutes.js');
    var assetRoutes = path.join(__dirname, 'assets', 'mock', 'routes.js');
    var assetFTLRoutes = path.join(__dirname, 'assets', 'mock', 'ftlRoutes.js');
    createFileIfNotExist(routesFile, assetRoutes);
    createFileIfNotExist(ftlRoutesFile, assetFTLRoutes);
    createDataFile('data.json', root);
    logger.info('Created basic mock files');
}

/*
 *   Creates a std. template file.
 */
function createTemplateFiles(root) {
    var folder = path.join(root, 'templates');
    var folderPath = helper.absolutePath(folder);
    helper.guarantyFolder(folderPath);
    var testTemplate = path.join(folderPath, 'home.ftl');
    var assetTemplate = path.join(__dirname, 'assets', 'templates', 'home.ftl');
    createFileIfNotExist(testTemplate, assetTemplate);
    createDataFile('home.json', root);
    logger.info('Created template basics');
}

/*
 *   Copies a data file.
 */
function createDataFile(dataFile, root) {
    var folder = path.join(root, 'data');
    helper.guarantyFolder(folder);
    var filePath = path.join(folder, dataFile);
    var assetFile = path.join(__dirname, 'assets', 'data', dataFile);
    createFileIfNotExist(filePath, assetFile);
}

/*
 *   Creates the configuration file.
 */
function createConfigFile(folder) {
    var filePath = path.join(folder, 'puerFConfig.js');
    var assetFile = path.join(__dirname, 'assets', 'puerFConfig.js');
    createFileIfNotExist(filePath, assetFile);
    logger.info('Created config file');
}

/*
 *   Saves a file if no such file exists.
 */
function createFileIfNotExist(file, fromFile) {
    try {
        fs.accessSync(file);
        logger.info(`${file} already exists, will not be overwritten`);
    } catch (e) {
        fs.createReadStream(fromFile).pipe(fs.createWriteStream(file));
    }
}
