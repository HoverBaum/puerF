var test = require('tape');
var fs = require('fs-extra');
var path = require('path');
var logger = require('../bin/logger');

//Disable logging for all tests.
//logger.disable();
logger.enableDebug()

//Path to be used for temporary files.
var tmpPath = path.join(__dirname, 'tmp');

//Test helper functionalities
var helperTest = require('./testHelper');
//helperTest(test, tmpPath);

//Test initialization script
var initializationTest = require('./testInitializer');
//initializationTest(test, tmpPath);

//Test generation of lookp for mocked routes
var mockRouterTest = require('./testMockRouter');
//mockRouterTest(test);

//Test PreProcessing module
var preProcessorTest = require('./testPreProcessor');
//preProcessorTest(test, tmpPath);

//Test main component does the right things given options.
var puerFTest = require('./testPuerF');
puerFTest(test, tmpPath);

test.onFinish(function() {
    console.log('all tests ended');
    //Cleanup after ourselfes.
    //if(fs.existsSync(tmpPath)) fs.removeSync(tmpPath);
    //var inf = process._getActiveHandles();
});
