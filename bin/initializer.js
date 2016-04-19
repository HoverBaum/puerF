/**

    Module to create basic working environment for puerf.
    Will create a folder for route files and create basic version.

    Possible options:
    onlyConfig      Only generate a configuration file.

*/

var path = require('path');
var fs = require('fs');
var logger = require('./logger');
var helper = require('./helper');

module.exports = function createInitializer() {

    /**
     *   Starts setting up basic files to work with puerF.
     */
    function startInitialization(options, callback) {
        logger.info('Initializing a basic setup for puerf');
        if (options.onlyConfig) {
            logger.info('Will only generate a config file');
        } else {
            createMockFiles(options.mockFolder);
            createTemplateFiles(options.templateFolder);
        }
        createConfigFile();
        logger.info(`Finished setting up, let's role`);
        if (callback) callback();
    }

    /**
     *   Creates std. mock files if none exist.
     */
    function createMockFiles(folder) {
        if (folder === undefined) {
            folder = 'mock';
        }
        var folderPath = helper.absolutePath(folder);
        helper.guarantyFolder(folderPath);
        var routesFile = path.join(folderPath, 'routes.js');
        var ftlRoutesFile = path.join(folderPath, 'ftlRoutes.js');
        var assetRoutes = path.join(__dirname, 'assets', 'mock', 'routes.js');
        var assetFTLRoutes = path.join(__dirname, 'assets', 'mock', 'ftlRoutes.js');
        createFileIfNotExist(routesFile, assetRoutes);
        createFileIfNotExist(ftlRoutesFile, assetFTLRoutes);
        createDataFile('data.json');
        logger.info('Created basic mock files');
    }

    /**
     *   Creates a std. template file.
     */
    function createTemplateFiles(folder) {
        if (folder === undefined) {
            folder = 'templates';
        }
        var folderPath = helper.absolutePath(folder);
        helper.guarantyFolder(folderPath);
        var testTemplate = path.join(folderPath, 'home.ftl');
        var assetTemplate = path.join(__dirname, 'assets', 'templates', 'home.ftl');
        createFileIfNotExist(testTemplate, assetTemplate);
        createDataFile('home.json');
        logger.info('Created template basics');
    }

    /**
     *   Copies a data file.
     */
    function createDataFile(dataFile) {
        var folder = path.join(process.cwd(), 'data');
        helper.guarantyFolder(folder);
        var filePath = path.join(folder, dataFile);
        var assetFile = path.join(__dirname, 'assets', 'data', dataFile);
        createFileIfNotExist(filePath, assetFile);
    }

    /**
     *   Creates the configuration file.
     */
    function createConfigFile() {
        var filePath = path.join(process.cwd(), 'puerFConfig.js');
        var assetFile = path.join(__dirname, 'assets', 'puerFConfig.js');
        createFileIfNotExist(filePath, assetFile);
        logger.info('Created config file');
    }

    /**
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

    return {
        init: startInitialization
    }

}();
