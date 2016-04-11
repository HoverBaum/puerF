var test = require('tape');
var fs = require('fs-extra');
var path = require('path');
var logger = require('../bin/logger');
logger.disable();

//Path to be used for temporary files.
var tmpPath = path.join(__dirname, 'tmp');

var helperTest = require('./testHelper');
helperTest(test, tmpPath);

var initializationTest = require('./testInitializer');
initializationTest(test, tmpPath);

var mockRouterTest = require('./testMockRouter');
mockRouterTest(test);

var preProcessorTest = require('./testPreProcessor');
preProcessorTest(test, tmpPath);

test.onFinish(function() {

    //Cleanup after ourselfes.
    fs.removeSync(tmpPath);
});
