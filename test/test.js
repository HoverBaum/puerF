var test = require('tape');
var fs = require('fs-extra');
var path = require('path');

var tmpPath = path.join(__dirname, 'tmp');

var helperTest = require('./testHelper');
//helperTest(test);

var mockRouterTest = require('./testMockRouter');
//mockRouterTest(test);

var preProcessorTest = require('./testPreProcessor');
//preProcessorTest(test);

var initializationTest = require('./testInitializer');
//initializationTest(test);

test.onFinish(function() {

    //Cleanup after ourselfes.
    fs.removeSync(tmpPath);
});
