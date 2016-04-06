/**

    Module to create basic working environment for puerf.
    Will create a folder for route files and create basic version.

    options {
        mockFolder,     Specifies the folder to use for mock files (default: mock)
        noMock,         If ture, does not create mock files
        templateFolder, Specifies the folder to use for template files (default: templates)
        noTemplate      If true, does not create template files
    }
}

*/

var logger = require('./logger');
ar helper = require('./helper')
var fs = require('fs');
var path = require('path');

module.exports = function createInitializer() {

    /**
     *   Starts setting up basic files to work with puerF.
     */
    function startInitialization(options) {
        logger.info('Initializing a basic setup for puerf');
        if(!options.noMock) {
            createMockFiles();
        } else {
            logger.info('Will not create mock files')
        }
        if(!options.noTemplate) {
            createTemplateFiles();
        } else {
            logger.info('Will not create template files')
        }
    }

    return {
        init: startInitialization
    }

}();
